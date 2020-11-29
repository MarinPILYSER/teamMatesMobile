import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Modal, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { Video } from 'expo-av';
import { Input, Button, ListItem, Overlay } from 'react-native-elements';
import HeaderComponent from '../components/Header'
import * as DocumentPicker from 'expo-document-picker';
import { ipAdress } from '../ipAdress';
import { connect } from 'react-redux';
import ImageViewer from 'react-native-image-zoom-viewer';
import GestureRecognizer from 'react-native-swipe-gestures';
import { withNavigationFocus } from 'react-navigation';



function TactiquesScreen({ navigation, userInfos, isFocused }) {


    //Overlay Création Fiches
    const [visible, setVisible] = useState(false);
    const [file, setFile] = useState(null)
    const [telecharger, setTelecharger] = useState('Télécharger une pièce jointe')
    const [title, setTitle] = useState('')

    // messages
    const [error, setError] = useState(['']);
    const [errorModal, setErrorModal] = useState(['']);

    const [loading, setLoading] = useState(<></>);

    // Modal Fiches
    const [visibleModal, setVisibleModal] = useState(false)
    const [contenu, setContenu] = useState(['http://res.cloudinary.com/teammates/video/upload/v1603972199/i6qqjrkjlkmpp5wtzmql.mp4'])
    const [isVideo, setIsVideo] = useState(true)

    // is Focused
    const [ok, setOk] = useState(true);

    // Liste des Fiches
    const [listeFiches, setListeFiches] = useState([]);

    // Si liste vide ou non
    var tactique;
    if (listeFiches.length == 0) {
        tactique = <Text style={{ fontSize: 17, fontWeight: 'bold', opacity: 0.5, marginBottom: 20 }}>Aucune fiche tactique</Text>
    } else {
        tactique = <Text style={{ fontSize: 17, fontWeight: 'bold', marginBottom: 20 }}>Toutes les fiches tactiques</Text>
    }

    

    // RECUPERATION DES FICHES
    const getFiches = async () => {
        const allFichesRaw = await fetch(`${ipAdress}/getFiches/${userInfos.team}`)
        let listeFiches = await allFichesRaw.json()
        setListeFiches(listeFiches.ficheInfos)
    };

    useEffect(() => {
        getFiches()
    }, [ok])

    // Lorsque isFocused
    if (isFocused && ok) {
        setOk(false)
    }
    if (!isFocused && !ok) {
        setOk(true)
    }

    // OVERLAY
    const toggleOverlay = () => {
        setVisible(!visible);
        setTitle('');
        setError([]);
        setFile(null);
        setTelecharger('Télécharger une pièce jointe')
    };

    // MODAL
    const toggleModal = (contenu) => {
        let media;
        if (contenu.type === 'image' || contenu.type === 'pdf') {
            setIsVideo(false)
            media = contenu.images.map((e) => {
                return ({ url: e })
            })
        } else if (contenu.type === 'video') {
            setIsVideo(true)
            media = contenu.images[0]
        }
        setContenu(media)
        setVisibleModal(!visibleModal);
    };

    // Recupération Fichier dans téléphone
    const findFile = async () => {
        const fileToUpload = await DocumentPicker.getDocumentAsync()
        if (fileToUpload.name != null) {
            setFile(fileToUpload);
            setTelecharger(fileToUpload.name)
        }
    }

    // Envoi Fichier
    const handleclick = async () => {
        if (title === '' || file === null) {
            setErrorModal(['Veuillez renseigner un titre et selectionner un fichier'])
        } else {
            setLoading(<View style={{ marginTop: 5 }}><ActivityIndicator size="small" color="#0000ff" /></View>)
            var data = new FormData();

            // Pour récuperer le type de fichier
            let tab = await file.uri.split('.');
            let extension = tab[tab.length - 1];
            let rawResponse = null
            data.append('media', {
                uri: file.uri,
                type: `file/${extension}`,
                name: title,
            });
            data.append('extension', extension)
            rawResponse = await fetch(`${ipAdress}/uploadFile/${userInfos.team}`, {
                method: 'post',
                body: data
            })
            const reponse = await rawResponse.json();
            if (reponse.result == true) {
                getFiches()
                setVisible(!visible);
                setLoading(<></>)
            } else {
                setLoading(<></>)
                setError(reponse.error)
            }
            setTitle('');
            setFile(null);
            setTelecharger('Télécharger une pièce jointe');
        }
    }

    // Affichage des erreurs

    var erreur = error.map((e, i) => {
        return (<Text key={i} >{e}</Text>)
    })

    var erreurModal = errorModal.map((e, i) => {
        return (<Text key={i} >{e}</Text>)
    })

    // Modal Image ou Video
    var mediaModal;
    if (isVideo) {
        mediaModal = <Video source={{ uri: contenu }}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode="cover"
            shouldPlay
            useNativeControls
            style={{ flex: 1 }} />
    }
    if (!isVideo) {
        mediaModal = <ImageViewer imageUrls={contenu} enableSwipeDown={true} onSwipeDown={() => setVisibleModal(!visibleModal)} />
    }

    // Si Coach
    var Coach = <></>
    if (userInfos.admin) {
        Coach =
            <TouchableOpacity style={{ flexDirection: "row", marginTop: 60 }} onPress={toggleOverlay}>
                <Entypo name="attachment" size={24} color="#FE7235" />
                <View style={{ flexDirection: "column" }}>
                    <Text style={{ fontSize: 20, fontWeight: "bold", marginLeft: 10 }}>Créer une fiche tactique</Text>
                    <View>{erreur}</View>
                </View>
            </TouchableOpacity>
    }

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', backgroundColor: '#fff', flexDirection: 'column' }} >
            <HeaderComponent navigation={navigation} />
            {Coach}
            <View style={{ flex: 1, marginTop: 35, marginBottom:25}}>
                {tactique}
                <ScrollView>
                    <View>
                        {listeFiches.map((e, i) => {
                            return (
                                <ListItem onPress={() => toggleModal(e)} key={i} bottomDivider containerStyle={{ marginTop: 10, backgroundColor: "#FB8532", borderRadius: 8 }}>
                                    <ListItem.Content >
                                        <ListItem.Title style={{ color: '#fff' }}>{e.name}</ListItem.Title>
                                    </ListItem.Content>
                                    <ListItem.Chevron />
                                </ListItem>
                            )
                        })}
                    </View>
                </ScrollView>
            </View>
            <View>
                <GestureRecognizer onSwipe={() => setVisibleModal(!visibleModal)} >
                    <Modal visible={visibleModal} transparent={true} >
                        {mediaModal}
                    </Modal>
                </GestureRecognizer>
            </View>


            <Overlay isVisible={visible} onBackdropPress={toggleOverlay} overlayStyle={{ alignItems: "center", justifyContent: "space-around", borderRadius: 20 }}>
                <>
                    <View>
                        <Text style={{ fontWeight: 'bold' }}>Créer une nouvelle tactique</Text>
                    </View>
                    <View>
                        <Input placeholder="Entrez un titre"
                            onChangeText={(value) => setTitle(value)}
                            value={title}
                            containerStyle={{
                                width: 343, height: 40, backgroundColor: "#FBFBFB", marginBottom: 26, marginTop: 25, underlineColorAndroid: 'white', borderBottomColor: 'white', shadowColor: "#000"}}
                            inputContainerStyle={{ borderBottomColor: 'transparent' }} />
                        <View>{erreurModal}{loading}</View>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Entypo name="attachment" size={24} color="#FE7235" />
                        <Text onPress={findFile} style={{ opacity: 0.7, marginLeft: 10 }}>{telecharger}</Text>
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <Text onPress={() => handleclick()} style={{ fontWeight: "bold" }}>Publier</Text>
                    </View>
                </>
            </Overlay>
        </View>
    )
}


function mapStateToProps(state) {
    return { userInfos: state.userInfos}
}

export default connect(
    mapStateToProps,
   null
)(withNavigationFocus(TactiquesScreen));


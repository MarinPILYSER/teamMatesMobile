import React, { useState} from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Text, Button, Divider, Input, Avatar } from 'react-native-elements'
import { Entypo, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { connect } from 'react-redux';
import { ipAdress } from '../ipAdress.js'

function CreatePostComponent({ teamInfos , userInfos, getActus}) {

    // messages d'erreur et loading button
    const [errorMessage, setErrorMessage] = useState(<></>);
    const [loading, setLoading] = useState(<></>);

    //Texte et média de la publication
    const [text, setText] = useState('')

    // Upload Picture
    const [hasPermission, setHasPermission] = useState(null);
    const [PictureName, setPictureName] = useState(<></>);
    const [fileToDownload, setFileToDownload] = useState("")

    const addPicture = async () => {
        //Je demande la permission d'accès à ma galerie photo
        const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
        setHasPermission(status === 'granted');
        //Si j'ai la permission, j'upload la photo
        if (hasPermission) {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
            if (result != undefined) {
                setFileToDownload(result.uri)
                setPictureName(<Text style={{ alignSelf: 'flex-start', margin: 10 }}><Entypo name="attachment" size={16} color="black" />File_{Math.random(4000)}</Text>)
            }

        }
    };

    // Creation Post 
    const publishPost = async () => {
        if (text === '') {
            setErrorMessage(<Text style={{ alignSelf: 'flex-start', margin: 10 }}>Veuillez écrire quelque chose</Text>)
        } else {
            // Bouton tournant loading 
            setLoading(<View style={{ marginTop: 5 }}><ActivityIndicator size="small" color="#0000ff" /></View>)

            //Préparer les data à envoyer dans mon back
            var data = new FormData();

            // Pour récuperer le type de fichier
            let tab = await fileToDownload.split('.');
            let extension = tab[tab.length - 1];
            if (fileToDownload) {
                data.append('media', {
                    uri: fileToDownload,
                    type: `file/${extension}`,
                    name: `file.${extension}`,
                });
            } 
            data.append('extension', extension)
            data.append('text', text)
            let rawResponse = await fetch(`${ipAdress}/newActu/${teamInfos.teamID}`, {
                method: 'post',
                body: data
            })

            const response = await rawResponse.json();
            if (response.result == true) {
                setText('');
                setFileToDownload("");
                setPictureName(<></>);
                setLoading(<></>); 
                getActus()
            } else {
                setLoading(<></>)
                setErrorMessage(response.error)
            }
        }



    }

    return (
        <View style={{ borderRadius: 40, height: 200, justifyContent: 'center', alignItems: 'center' }} >
            <View style={{ width: '100%' }}>
                <Text style={{ fontSize: 20, paddingLeft: 10, fontWeight: '600' }}>Créer une publication</Text>
                <Divider style={{ marginTop: 20 }} />
            </View>
            <View style={{ display: "flex", flexDirection: 'row', width: '90%', justifyContent: 'space-between' }}>
                <Avatar rounded containerStyle={{ alignSelf: 'center', marginRight: 10, }} source={{ uri: userInfos.picture_Url }} />
                <Input onChangeText={(value) => setText(value)} containerStyle={{ backgroundColor: '#ffffff', borderColor: 'white', width: '80%', marginTop: 10 }} placeholder='écrivez quelque chose' />
                <Ionicons name="ios-camera" size={24} color="black" style={{ alignSelf: 'center' }} onPress={addPicture} />
            </View>
            {errorMessage}
            {PictureName}
            <Button onPress={publishPost} title="Publiez" titleStyle={{ color: 'white', fontSize: 15 }} buttonStyle={{ backgroundColor: "#FE7235", width: 300, height: 33, borderRadius: 40, color: "black" }} />
            {loading}
        </View>
    )
}
function mapStateToProps(state) {
    return { userInfos: state.userInfos, listeActu: state.listeActu, teamInfos: state.teamInfos }
}

function mapDispatchToProps(dispatch) {
    return {
        updateActu: function (listeActu) {
            dispatch({ type: 'majActu', listeActu })
        }
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CreatePostComponent);

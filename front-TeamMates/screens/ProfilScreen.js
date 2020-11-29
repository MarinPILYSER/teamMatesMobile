import React, { useState} from 'react';
import { StyleSheet, View, Text, ActivityIndicator, TouchableOpacity, Clipboard, KeyboardAvoidingView } from 'react-native';
import { Avatar, Divider, Overlay, Input, Button, Accessory } from 'react-native-elements'
import HeaderComponent from '../components/Header'
import { FontAwesome } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { ipAdress } from '../ipAdress.js'
import * as ImagePicker from 'expo-image-picker';
import moment from 'moment';
import DateTimePickerModal from "react-native-modal-datetime-picker";

function ProfilScreen({ navigation, userInfos, updateReducer, teamInfos }) {

    // Afficher le modal de modification de profil
    const [isVisible, setIsVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState(<></>);
    const [loading, setLoading] = useState(<></>);

    // Pour le code d'équipe (réservé au profil admin)
    const [copieOk, setCopieOk] = useState(false)
    var copie;
    if (!copieOk) {
        copie = <Button title="Copier" onPress={() => { Clipboard.setString(teamInfos.teamCode); setCopieOk(true) }} buttonStyle={{ alignSelf: 'center', backgroundColor: "#FE7235", width: 100, height: 52, marginTop: 20 }} titleStyle={{ color: 'white' }} />
    }
    if (copieOk) {
        copie = <Button title="Copié" buttonStyle={{ alignSelf: 'center', backgroundColor: "white", width: 100, height: 52, marginTop: 20, borderWidth: 1, borderColor: '#FE7235' }} titleStyle={{ color: '#FE7235' }} />
    }

    // Update user
    const [name, setName] = useState(userInfos.name)
    const [picture_Url, setPicture_Url] = useState(userInfos.picture_Url)
    const [firstname, setFirstname] = useState(userInfos.firstname)
    const [email, setEmail] = useState(userInfos.email)
    const [date_of_birth, setDate_of_birth] = useState(userInfos.date_of_birth)
    const [password, setPassword] = useState('')

    // Pour l'input date (j'ai suivi la doc)
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const toggleDatePicker = () => {
        setDatePickerVisibility(!isDatePickerVisible);
    };
    const handleConfirm = (date) => {
        setDate_of_birth(date)
        toggleDatePicker();
    };

    // Upload Avatar
    const [hasPermission, setHasPermission] = useState(null);
    const [avatarURLToUpload, setAvatarURLToUpload] = useState(userInfos.picture_Url)

    // Ouverture du modal
    const modifyProfil = () => {
        setIsVisible(!isVisible);
    };

    const updateAvatar = async () => {
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
            setAvatarURLToUpload(result.uri)
        }
    };

    const updateProfil = async () => {
        setLoading(<View style={{ marginTop: 5 }}><ActivityIndicator size="small" color="#0000ff" /></View>)
        if (password === '') {
            setErrorMessage(<Text style={{ color: "red", alignSelf: 'center' }}>Veuillez entrez votre mot de passe</Text>)
        } else {
            //Envoi de la photo sur mon back 
            var data = new FormData();

            data.append('avatar', {
                uri: avatarURLToUpload,
                type: 'image/jpeg',
                name: 'user_avatar.jpg',
            });
            //Envoi du token et des infos des inputs sur mon back 
            var userinfos = {
                token: userInfos.token,
                name: name,
                firstname: firstname,
                email: email,
                date_of_birth: date_of_birth,
                password: password
            };
            data.append('userinfos', JSON.stringify(userinfos));

            var updateUser = await fetch(`${ipAdress}/users/updateUser`, {
                method: 'post',
                body: data
            })
            var response = await updateUser.json();

            if (response.result == false) {
                setLoading(<></>)
                setErrorMessage(<Text style={{ color: "red", alignSelf: 'center' }}>{response.error}</Text>)
            } else {
                updateReducer(response.userInfos)
                setErrorMessage(<></>)
                setIsVisible(!isVisible);
                setLoading(<></>)
                setPicture_Url(avatarURLToUpload)
            }
        }

    };



    return (
        <View style={styles.container}>
            <HeaderComponent navigation={navigation} />
            <View style={{ height: 200, justifyContent: 'center', alignSelf: 'center', alignItems: 'center', marginTop: 10 }}>
                <Avatar size="large" rounded source={{ uri: picture_Url }} >
                    <Accessory onPress={modifyProfil} size={24} />
                </Avatar>
                <Text style={{ fontSize: 20, fontStyle: 'normal', marginTop: 10, }}>{firstname} {name}</Text>
                {/* <SimpleLineIcons name="pencil" size={24} color="black" onPress={modifyProfil} /> */}
            </View>
            <View style={{ justifyContent: 'flex-start', alignSelf: 'flex-start', marginHorizontal: 20 }}>
                <Text style={{ fontSize: 18, fontStyle: 'normal', marginTop: 10, color: 'grey' }}>Prénom : {firstname}</Text>
                <Divider style={{ marginTop: 10, width: 330 }} />
                <Text style={{ fontSize: 18, fontStyle: 'normal', marginTop: 10, color: 'grey' }}>Nom : {name}</Text>
                <Divider style={{ marginTop: 10, width: 330 }} />
                <Text style={{ fontSize: 18, fontStyle: 'normal', marginTop: 10, color: 'grey' }}>Adresse e-mail : {email}</Text>
                <Divider style={{ marginTop: 10, width: 330 }} />
                <Text style={{ fontSize: 18, fontStyle: 'normal', marginTop: 10, color: 'grey' }}>Date de naissance : {moment(date_of_birth).format("DD/MM/YYYY")}</Text>
                <Divider style={{ marginTop: 10, width: 330 }} />
            </View>

            {userInfos.admin ?
                <TouchableOpacity style={{ justifyContent: 'center', alignSelf: 'center', margin: 20 }} onPress={() => { Clipboard.setString(teamInfos.teamCode), setCopieOk('    Copié !') }}>
                    <Text style={{ fontSize: 26, fontStyle: 'normal', marginTop: 10, color: '#FE7235', alignSelf: 'center' }}>Votre code d'équipe</Text>
                    <Text style={{ fontSize: 18, fontStyle: 'normal', marginTop: 10, color: 'grey', alignSelf: 'center' }}>{teamInfos.teamCode}</Text>
                    <View>{copie}</View>
                </TouchableOpacity>
                :
                <></>
            }

            <Overlay overlayStyle={{ borderRadius: 20, height: '80%', width: '80%' }} isVisible={isVisible} onBackdropPress={modifyProfil}>
                <KeyboardAvoidingView behavior="height" enabled>
                    <View>
                        <View style={{ flexDirection: 'row', alignSelf: 'center', marginBottom: 20, marginTop: 20 }}>
                            <Avatar size="large" rounded source={{ uri: avatarURLToUpload }} />
                            <View style={{ alignSelf: 'center', marginLeft: 20, justifyContent: "flex-start" }}>
                                <Button title="Ajouter un avatar" titleStyle={{ color: 'black', fontSize: 19, fontWeight: '500' }} buttonStyle={{ backgroundColor: "#ffffff", alignSelf: "flex-start" }} onPress={updateAvatar} />
                                <FontAwesome name="upload" size={24} color="black" onPress={updateAvatar} />
                            </View>
                        </View>
                        <Input placeholder={userInfos.name} onChangeText={(val) => setName(val)} />
                        <Input placeholder={userInfos.firstname} onChangeText={(val) => setFirstname(val)} />
                        <Input placeholder={userInfos.email} onChangeText={(val) => setEmail(val)} />
                        <Input placeholder={moment(date_of_birth).format("DD/MM/YYYY")} onFocus={toggleDatePicker} />
                        <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            mode="datetime"
                            onConfirm={handleConfirm}
                            onCancel={toggleDatePicker}
                        />
                        {errorMessage}
                        <Input placeholder='Mot de passe' onChangeText={(val) => setPassword(val)}  secureTextEntry={true} />
                        {loading}
                        <Button title="Mettre à jour" titleStyle={{ color: 'white', fontSize: 15, fontFamily: 'Roboto-Regular', }} buttonStyle={{ backgroundColor: userInfos.admin ? "#FE7235" : "#3893DC", width: 200, height: 50, borderRadius: 40, alignSelf: 'center' }} containerStyle={{ marginBottom: 10, marginTop: 30 }} onPress={updateProfil} />
                    </View>
                </KeyboardAvoidingView>

            </Overlay>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: "flex-start",
    },
    datePickerStyle: {
        alignSelf: "center",
        width: '95%',
        marginTop: 20,
        marginBottom: 20,
    }
});
const pickerStyle = {
    inputIOS: {
        color: 'black',
        paddingTop: 13,
        paddingHorizontal: 10,
        paddingBottom: 12,
        backgroundColor: '#FBFBFB',
    },
    inputAndroid: {
        color: 'black',
        backgroundColor: '#FBFBFB',
    },
    placeholderColor: 'black',
    underline: { borderWidth: 1 },

};

function mapStateToProps(state) {
    return { userInfos: state.userInfos, teamInfos: state.teamInfos }
}

function mapDispatchToProps(dispatch) {
    return {
        updateReducer: function (userInfos) {
            dispatch({ type: 'majUser', userInfos: userInfos })
        }
    }
}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProfilScreen);

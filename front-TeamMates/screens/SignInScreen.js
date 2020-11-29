import React, { useState } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Text, Button, Input } from 'react-native-elements';
import { AntDesign } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ipAdress } from '../ipAdress.js';
import { connect } from 'react-redux';

function SignInScreen({ navigation, findUser, findTeam }) {

    const [mail, setMail] = useState('')
    const [password, setPassword] = useState('')
    const [listErrorsSignin, setErrorsSignin] = useState([]);

    var handleSubmitSignin = async () => {
        var rawResponse = await fetch(`${ipAdress}/users/sign-in`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `email=${mail}&password=${password}`
        })
        var response = await rawResponse.json();
        if (response.result === true) {
            findUser(response.userInfos)
            findTeam(response.teamInfos)
            navigation.navigate('DashboardScreen')
        } else {

            setErrorsSignin(response.error)
        }
    }

    var tabErrorsSignin = listErrorsSignin.map((error, i) => {
        return (<Text style={{ color: 'red', marginRight: 'auto', marginBottom: 5 }}>{error}</Text>)
    })

    return (
        <View>
            <Icon style={{ marginLeft: 200, zIndex: 0, position: 'absolute', bottom: 300 }} size={500} name="circle-thin" color='#00C4F9' />
            <View style={{ zIndex: 1, marginTop: 50 }}>
                <AntDesign onPress={() => { navigation.navigate('HomeScreen') }} name="back" size={24} color="black" style={{ position: 'absolute', top: 0, left: 5 }} />
                <Image
                    style={{ width: 100, height: 100, marginBottom: 10, alignSelf: 'center' }}
                    source={require('../assets/logo_TM_V2.png')}
                />
                <Text h4 style={{ marginLeft: 20, marginTop: 15 }}>CONNEXION À</Text>
                <Text h4 style={{ color: '#FE7235', marginLeft: 20, marginBottom: 20 }}>TEAM MATES</Text>
                <View style={{ alignItems: 'center', width: '95%', alignSelf: 'center' }}>
                    {tabErrorsSignin}
                    <Input
                        containerStyle={{
                            width: '93%', height: 52, backgroundColor: "#FBFBFB", marginBottom: 26, underlineColorAndroid: 'white', borderBottomColor: 'white', shadowColor: "#000",
                        }}
                        inputContainerStyle={{ borderBottomColor: 'transparent', }}
                        placeholder="Adresse mail"
                        onChangeText={(value) => setMail(value)}
                        value={mail}
                    />

                    <Input
                      containerStyle={{
                        width: '93%', height: 52, backgroundColor: "#FBFBFB", marginBottom: 26, underlineColorAndroid: 'white', borderBottomColor: 'white', shadowColor: "#000",
                    }}
                    inputContainerStyle={{ borderBottomColor: 'transparent', }}
                        placeholder="Mot de passe"
                        onChangeText={(value) => setPassword(value)}
                        value={password}
                        secureTextEntry={true}
                    />
                    <Button onPress={handleSubmitSignin} title="CONNEXION" buttonStyle={{ backgroundColor: "#FE7235", width: 330, height: 50, borderRadius: 10, marginBottom: 20 }} />
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text>Vous n'êtes pas encore membre ?</Text>
                        <Button titleStyle={{ color: 'black', fontSize: 14, fontWeight:'600' }} onPress={() => { navigation.navigate('SignUpHomeScreen') }} title="inscrivez-vous !" type='clear' />
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
});

function mapDispatchToProps(dispatch) {
    return {
        findUser: function (userInfos) {
            dispatch({ type: 'majUser', userInfos: userInfos })
        },
        findTeam: function (teamInfos) {
            dispatch({ type: 'majTeam', teamInfos: teamInfos })
        }
    }
}

export default connect(
    null,
    mapDispatchToProps
)(SignInScreen)
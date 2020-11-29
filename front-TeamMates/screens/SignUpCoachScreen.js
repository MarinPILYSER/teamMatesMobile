import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, Button,  CheckBox, Input} from 'react-native-elements';
import { AntDesign } from '@expo/vector-icons';
import { ipAdress } from '../ipAdress.js';
import DatePicker from 'react-native-datepicker'
import { connect } from 'react-redux';

function SignUpCoachScreen({ navigation, addUser }) {

    const [check, setCheck] = useState(false)
    const [errorMessage, setErrorMessage] = useState(<></>)
    const [mail, setMail] = useState('')
    const [password, setPassword] = useState('')
    const [firstname, setFirstname] = useState('')
    const [name, setName] = useState('')
    const [date, setDate] = useState()
    const [currentDate, setCurrentDate] = useState('');
    const [listErrorsSignup, setErrorsSignup] = useState([])
    const admin = true

    useEffect(() => {
        var day = new Date().getDate();
        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();
        setCurrentDate(
            year + '/' + month + '/' + day
        );
    }, []);

    const CheckFonc = () => {
        setCheck(!check);
    };


    var handleSubmitSignup = async () => {
        if (check == false) {
            setErrorMessage(<Text style={{ color: 'red', alignSelf: 'center', marginBottom: 5 }}>Veuillez accepter les conditions d'utilisation</Text>)
        } else {
            var rawResponse = await fetch(`${ipAdress}/users/sign-up`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `admin=${admin}&name=${name}&firstname=${firstname}&date_of_birth=${date}&email=${mail}&password=${password}`
            })
            var response = await rawResponse.json();
            if (response.result) {
                addUser(response.userInfos)
                navigation.navigate('TeamInfoCoach')
            } else {
                setErrorsSignup(response.error)
            }
        }

    }

    var tabErrorsSignup = listErrorsSignup.map((error, i) => {
        return (<Text style={{ color: 'red', marginRight: 'auto', marginBottom: 5 }}>{error}</Text>)
    })

    return (
        <ScrollView>
            <AntDesign onPress={() => { navigation.navigate('SignUpHomeScreen') }} name="back" size={24} color="black" style={{ position: 'absolute', top: 40, left: 5 }} />
            <Text h4 style={{ marginLeft: 20, marginTop: 70 }}>INSCRIPTION À</Text>
            <Text h4 style={{ color: '#FE7235', marginLeft: 20, marginBottom: 20 }}>TEAM MATES</Text>
            <View style={{ alignItems: 'center', width: '95%', alignSelf: 'center' }}>
                {tabErrorsSignup}
                <Input
                    containerStyle={{ width: '93%', height: 52, backgroundColor: "#FBFBFB", marginBottom: 26, underlineColorAndroid: 'white', borderBottomColor: 'white', shadowColor: "#000" }}
                    inputContainerStyle={{ borderBottomColor: 'transparent' }}
                    inputContainerStyle={{ borderBottomColor: 'transparent' }}
                    placeholder="Adresse mail"
                    onChangeText={(value) => setMail(value)}
                    value={mail}
                />

                <Input
                    containerStyle={{ width: '93%', height: 52, backgroundColor: "#FBFBFB", marginBottom: 26, underlineColorAndroid: 'white', borderBottomColor: 'white', shadowColor: "#000" }}
                    inputContainerStyle={{ borderBottomColor: 'transparent' }}
                    placeholder="Mot de passe"
                    onChangeText={(value) => setPassword(value)}
                    value={password}
                    secureTextEntry={true}
                />

                <Input
                    containerStyle={{ width: '93%', height: 52, backgroundColor: "#FBFBFB", marginBottom: 26, underlineColorAndroid: 'white', borderBottomColor: 'white', shadowColor: "#000" }}
                    inputContainerStyle={{ borderBottomColor: 'transparent' }}
                    placeholder="Prénom"
                    onChangeText={(value) => setFirstname(value)}
                    value={firstname}
                />

                <Input
                    containerStyle={{ width: '93%', height: 52, backgroundColor: "#FBFBFB", marginBottom: 26, underlineColorAndroid: 'white', borderBottomColor: 'white', shadowColor: "#000" }}
                    inputContainerStyle={{ borderBottomColor: 'transparent' }}
                    placeholder="Nom"
                    onChangeText={(value) => setName(value)}
                    value={name}
                />

                <DatePicker
                    
                    style={{ width: '93%',  marginBottom: 26,height: 52, backgroundColor: "#FBFBFB", underlineColorAndroid: 'white', borderBottomColor: 'white', shadowColor: "#000" }}
                    showIcon={false}
                    date={date}
                    mode="date"
                    placeholder="Date de naissance"
                    format="YYYY-MM-DD"
                    minDate="1900-01-01"
                    maxDate={currentDate}
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    customStyles={{
                        dateInput: {
                            alignItems: 'flex-start',
                            backgroundColor: '#FBFBFB',
                            borderColor: '#FBFBFB',
                            height: 50
                        },
                        placeholderText: {
                            marginLeft:10,
                            fontSize: 17,
                            color: "grey"
                        },
                        dateText: {
                            marginLeft:10,
                            fontSize: 17,
                            color: "black"
                        }
                    }}
                    onDateChange={(date) => { setDate(date) }}
                /> 


                <CheckBox
                    center
                    containerStyle={{ marginBottom: 26, width: '93%', backgroundColor: 'transparent' }}
                    textStyle={{ fontSize: 12, fontWeight: 'normal' }}
                    title="En cliquant sur Créer un compte ou en vous inscrivant, vous acceptez les Conditions d'utilisation et la Politique de confidentialité."
                    checkedIcon='check-square-o'
                    uncheckedIcon='square-o'
                    onIconPress={CheckFonc}
                    checked={check}
                />
                {errorMessage}
                <Button onPress={handleSubmitSignup} title="CRÉER UNE TEAM" buttonStyle={{ backgroundColor: "#FE7235", width: 325, height: 50, borderRadius: 10, marginBottom: 20 }} />
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text>Vous avez déjà un compte ?</Text>
                    <Button onPress={() => navigation.navigate('SignInScreen')} title="connectez-vous !" type='clear' />
                </View>
            </View>
        </ScrollView>
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
        addUser: function (userInfos) {
            dispatch({ type: 'majUser', userInfos: userInfos })
        }
    }
}

export default connect(
    null,
    mapDispatchToProps
)(SignUpCoachScreen)
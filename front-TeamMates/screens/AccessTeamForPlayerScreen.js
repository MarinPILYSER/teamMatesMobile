import React, { useState } from 'react'
import { View, Image, KeyboardAvoidingView } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Button, Input, Text } from 'react-native-elements';
import { connect } from 'react-redux';
import { ipAdress } from '../ipAdress.js';


function AccessTeamForPlayerScreen({ navigation, token, findTeam, findUser }) {

  // Input Code
  const [code, setcode] = useState();

  // Erreurs
  const [errorsJoinTeam, setErrorsJoinTeam] = useState([]);

  var tabErrors = errorsJoinTeam.map((error, i) => {
    return (<Text style={{ color: 'red', marginRight: 'auto', marginBottom: 5 }}>{error}</Text>)
  })

  // Envoi au Backend
  var handleSubmitJoinTeam = async () => {

    var rawResponse = await fetch(`${ipAdress}/joinTeam`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `code=${code}&token=${token}`
    })
    var response = await rawResponse.json()
    if (response.result == true) {
      findTeam(response.teamInfos)
      findUser(response.userInfos)
      navigation.navigate('DashboardScreen')
    } else {
      setErrorsJoinTeam(response.error)
    }
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', backgroundColor: '#00C4F9' }} >
      <View style={{ marginTop: 20 }}>
        <AntDesign onPress={() => { navigation.navigate('SignUpPlayerScreen') }} name="back" size={24} color="black" style={{ position: 'absolute', top: 20, left: -130 }} />
        <Image source={require('../assets/logowhite.png')} style={{ width: 85, height: 85, marginTop: 80, marginBottom: 100 }} />
      </View>
      <KeyboardAvoidingView behavior="position" enabled>
        <View>
          <View style={{ marginBottom: 20}}>
            <Text h4 style={{ color: "white" }}>Entrez votre code d’accès</Text>
            <Text style={{ color: "white" }}>
            Ce code vous a été remis par votre{"\n"}
            coach lors de votre inscription.
            </Text>
          </View>
          {tabErrors}
          <Input containerStyle={{
            width: 343, height: 52, backgroundColor: "white", marginBottom: 26, underlineColorAndroid: 'white', borderBottomColor: 'white', shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 3,
            },
            shadowOpacity: 0.27,
            shadowRadius: 4.65,

            elevation: 6,
          }}
            inputContainerStyle={{ borderBottomColor: 'transparent' }}

            placeholder=""
            onChangeText={(value) => setcode(value)}
            value={code}
          />

          <Button onPress={() => { handleSubmitJoinTeam() }} title="REJOINDRE MON ÉQUIPE" buttonStyle={{ backgroundColor: "#FE7235", width: 343, height: 52 }} />
        </View>
      </KeyboardAvoidingView>
    </View>
  )
}

function mapStateToProps(state) {
  return { token: state.userInfos.token }
}

function mapDispatchToProps(dispatch) {
  return {
    findTeam: function (teamInfos) {
      dispatch({ type: 'majTeam', teamInfos: teamInfos })
    },
    findUser: function(userInfos){
      dispatch({type: 'majUser', userInfos: userInfos})
  },
  }
}

export default
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AccessTeamForPlayerScreen);




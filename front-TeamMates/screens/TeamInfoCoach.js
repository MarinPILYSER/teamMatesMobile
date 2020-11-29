import React, { useState } from 'react'
import { View, Image, KeyboardAvoidingView } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Button, Input, Text, Divider } from 'react-native-elements';
import {ipAdress} from '../ipAdress.js';
import {connect} from 'react-redux';

function TeamInfoCoach({navigation, userInfos, addTeam, addUser}) {


  const [team, setTeam] = useState("");
  const [sport, setSport] = useState("");
  const [listErrorsCreateTeam, setErrorsCreateTeam] = useState([])

  var handleSubmitCreateTeam = async () => {
    var rawResponse = await fetch(`${ipAdress}/newTeam`, {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `name_of_team=${team}&sport=${sport}&token=${userInfos.token}`
    })
    var response = await rawResponse.json();
    if(response.result == true){
        navigation.navigate('CodeAccessCoachForPlayers')
        addTeam(response.teamInfos)
        addUser(response.userInfos)
    } else {
        setErrorsCreateTeam(response.error)
    }
}

var tabErrorsCreateTeam = listErrorsCreateTeam.map((error,i) => {
  return(<Text style={{color: 'red', marginRight: 'auto', marginBottom: 5}}>{error}</Text>)
})

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', backgroundColor: '#00C4F9' }} >
      <View style={{ marginTop: 20}}>
        <AntDesign onPress={() => { navigation.navigate('SignUpCoachScreen') }} name="back" size={24} color="black" style={{ position: 'absolute', top: 20, left: -130 }} />
        <Image source={require('../assets/logowhite.png')} style={{ width: 85, height: 85, marginTop: 80, marginBottom: 100 }} />
      </View>
      <KeyboardAvoidingView behavior="position" enabled>
        <View style={{ alignItems: 'center', width: '95%', alignSelf: 'center' }}>
          <View style={{ marginBottom: 20 }}>
            <Text h4 style={{ color: "white"}}>BIENVENUE SUR</Text>
            <Text h4 style={{ color: "white"}}>TEAM MATES !</Text>
            <Text style={{ color: "white"}}>Créez votre Team et invitez vos élèves grâce à un code d’accès.</Text>
          </View>
          {tabErrorsCreateTeam}
          <Input 
            containerStyle={{ width: '93%', height: 52, backgroundColor: "#FBFBFB", marginBottom: 26, underlineColorAndroid: 'white', borderBottomColor: 'white', shadowColor: "#000" }}
            inputContainerStyle={{ borderBottomColor: 'transparent' }}
            placeholder="Nom de votre équipe"
            onChangeText={(value) => setTeam(value)}
            value={team}
          />

          <Input 
            containerStyle={{ width: '93%', height: 52, backgroundColor: "#FBFBFB", marginBottom: 26, underlineColorAndroid: 'white', borderBottomColor: 'white', shadowColor: "#000" }}
            inputContainerStyle={{ borderBottomColor: 'transparent' }}
            placeholder="Votre sport"
            onChangeText={(value) => setSport(value)}
            value={sport}
          />
          <Button onPress={() => { handleSubmitCreateTeam()}} title="CRÉER MA TEAM" buttonStyle={{ backgroundColor: "#FE7235", width: 320, height: 52, borderRadius: 5 }}  />
        </View>
      </KeyboardAvoidingView>
      </View>
  )
}

function mapStateToProps(state){
  return {userInfos: state.userInfos}
}

function mapDispatchToProps(dispatch){
  return {
    addTeam: function(teamInfos){
      dispatch({type: 'majTeam', teamInfos: teamInfos})
    },
    addUser: function(userInfos){
      dispatch({type: 'majUser', userInfos: userInfos})
    }
  }
}
  
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(TeamInfoCoach)
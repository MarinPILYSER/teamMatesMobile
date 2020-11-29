import React, { useState } from 'react'
import { View, Image, TouchableOpacity, Clipboard } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Button, Text } from 'react-native-elements';
import { connect } from 'react-redux';

function CodeAccessCoachForPlayers({ navigation, teamInfos }) {

  const [copieOk, setCopieOk] = useState(false)

  var copie;
  if (!copieOk) {
    copie = <Button title="Copier" onPress={() => { Clipboard.setString(teamInfos.teamCode); setCopieOk(true)}} buttonStyle={{ backgroundColor: "#FFFFFF", width: 100, height: 52,marginTop: 20 }} titleStyle={{color:'black'}}/>
  }
  if (copieOk) {
    copie = <Text h4 style={{ color: "white", marginTop: 20, textAlign:'center' }}>Copié !</Text>
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', backgroundColor: '#00C4F9' }} >
      <View style={{ marginTop: 20, marginBottom: -50 }}>
        <AntDesign onPress={() => { navigation.navigate('TeamInfoCoach') }} name="back" size={24} color="black" style={{ position: 'absolute', top: 20, left: -130 }} />
        <Image source={require('../assets/logowhite.png')} style={{ width: 85, height: 85, marginTop: 80, marginBottom: 140 }} />
      </View>
      <View style={{ alignItems: 'center', }}>
        <View style={{ marginBottom: 50, alignItems: 'center' }}>
          <Text h4 style={{ color: "white" }}>ET VOILA !</Text>
          <TouchableOpacity onPress={() => { Clipboard.setString(teamInfos.teamCode), setCopieOk('    Copié !') }}>
            <Text h4 style={{ color: "white", opacity: 0.7, marginTop: 20 }}>{teamInfos.teamCode}</Text>
            <View>{copie}</View>
          </TouchableOpacity>
          <View style={{ alignItems: 'center', marginTop: 20 }}>
            <Text style={{ color: "white", textAlign:'center' }}>
              Partagez ce code à tous les {"\n"}
             membres de votre Team afin qu’ils{"\n"}
             puissent la rejoindre en s’inscrivant{"\n"}
             sur l’application. Il sera accessible{"\n"}
             à tout moment depuis votre {"\n"}
             espace personnel
             </Text>
          </View>
        </View>
        <Button onPress={() => navigation.navigate('DashboardScreen')} title="ACCÉDER A MON ESPACE PERSONNEL" buttonStyle={{ backgroundColor: "#FE7235", width: 343, height: 52 }} />
      </View>
    </View>
  )
}

function mapStateToProps(state) {
  return { teamInfos: state.teamInfos }
}

export default connect(
  mapStateToProps,
  null
)(CodeAccessCoachForPlayers)

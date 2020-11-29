import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Avatar } from 'react-native-elements';
import HeaderComponent from '../components/Header'
import { ipAdress } from '../ipAdress.js'
import { connect } from 'react-redux';
import { withNavigationFocus } from 'react-navigation';

function MembersScreen({ navigation, userInfos, teamInfos, isFocused }) {

  const [membersList, setMembersList] = useState([]);
  const [ok, setOk] = useState(true);

 const getMembers = async () => {
        const allMembersRaw = await fetch(`${ipAdress}/getTeamMembers/${userInfos.team}`)
        let allMembers = await allMembersRaw.json()
        setMembersList(allMembers.membresTeam)
    }
    
  // RECUPERATION DES MEMBRES A L'OUVERTURE
useEffect(()=>{
  getMembers()
}, [ok])
 
    // Lorsque isFocused
  
  if (isFocused && ok) {
    setOk(false)
  }
  if (!isFocused && !ok) {
    setOk(true)
  }
 
  return (
    <View style={{ flex: 1 }}>
      <HeaderComponent navigation={navigation} />
      <ScrollView >
        <View style={{ justifyContent: "center", alignItems: 'center', marginTop: 20 }}>
          <Text style={{ fontWeight: "bold", fontSize: 30, color: '#FE7235' }}>{teamInfos.teamName}</Text>
          {membersList.map((e, i) => {
            if (e.admin == true) {
              return (
                <View key={i} style={{ height: 101, alignItems: 'center' }}>
                  <Text style={{ fontWeight: "bold", fontSize: 20, marginTop: 20, marginBottom:20}}> Le Coach</Text>
                  <Avatar size="large" rounded source={{ uri: e.picture_Url }}>
                  </Avatar>
                  <View style={{width : "100%",alignSelf:'center'}}>
                    <Text style={{ marginTop:5}}>{e.firstname} {e.name}</Text>
                  </View>
                </View>)
            }
          })
          }
         
        </View>
         <Text style={{ fontWeight: "bold", fontSize: 20, textAlign: 'center', marginTop: 70, marginBottom:20 }} >Team Mates</Text>
        <View style={{ marginTop: 20, flexDirection: "row", justifyContent: 'space-between', flexWrap: 'wrap' }}>
        
        {membersList.map((e, i) => {
            if (e.admin == false) {
              return (
                <View key={i} style={{ marginTop:5,marginBottom:20, width: 112, height: 101, alignItems: 'center' }}>
                  <Avatar size="large" rounded source={{ uri: e.picture_Url }}>
                  </Avatar>
                  <View>
                    <Text style={{ marginTop:5}}>{e.firstname} {e.name}</Text>
                  </View>
                </View>
              )
            }
            })}
        </View>
      </ScrollView>
    </View>
  )

} 


function mapStateToProps(state) {
  return { userInfos: state.userInfos, teamInfos: state.teamInfos }
}

export default connect(
  mapStateToProps,
  null
)(withNavigationFocus(MembersScreen));

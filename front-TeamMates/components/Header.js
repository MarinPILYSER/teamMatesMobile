import React,{useEffect,useState} from 'react';
import { Header } from 'react-native-elements'
import { View } from 'react-native';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import socketIOClient from "socket.io-client";
var socket = socketIOClient(`${ipAdress}`);
import {ipAdress} from '../ipAdress.js';

function HeaderComponent({navigation, hideButton, userInfos,teamInfos}) {

const [messagTemp, setmessagTemp] = useState({
  token_author: userInfos.token,
  team : teamInfos.teamID
})
 
useEffect(() => {

    socket.on('newMessage', (newMessageData) => {
      setmessagTemp(newMessageData)

     
      });
  }, [])
 
  
  useEffect(() => {
    if (messagTemp.token_author != userInfos.token && messagTemp.team === teamInfos.teamID ){
  
      if(Toast != null){
            
        Toast.show({
            text1:  `${messagTemp.author}` ,
            text2: `${messagTemp.message}`,
            visibilityTime: 2000,
            autoHide: true,
            topOffset: 30,
            bottomOffset: 40,
            onShow: () => {},
            onHide: () => {}
          })
    }
    }
  }, [messagTemp])

  return (
    <View style={{width: '100%'}} >
      <Header 
      containerStyle={{
        height: 120,
        backgroundColor: userInfos.admin ? "#FE7235" : "#3893DC"
      }}
        leftComponent={<Ionicons name="md-home" size={35} color="white" onPress={() => { navigation.navigate('DashboardScreen') }}/>}
        centerComponent={{ text: `Bonjour ${userInfos.firstname}`, style: { color: '#fff', fontSize: 20, } }}
        rightComponent={hideButton? null: <Ionicons name="md-menu" size={35} color="white" onPress={() => {navigation.openDrawer()}}  />}
      />
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </View>
  );
}

function mapStateToProps(state) {
  return { userInfos: state.userInfos, teamInfos: state.teamInfos }
}

export default connect(
  mapStateToProps,
  null
)(HeaderComponent);

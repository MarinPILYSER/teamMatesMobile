import React,{useState, useEffect} from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView  } from 'react-native';
import {Button, ListItem, Input, Badge, Avatar,} from 'react-native-elements';
import HeaderComponent from '../components/Header';
import Icon from 'react-native-vector-icons/FontAwesome';
import socketIOClient from "socket.io-client";
import {ipAdress} from '../ipAdress.js';
import { connect } from 'react-redux';
import moment from 'moment';
import Toast from 'react-native-toast-message'
var socket = socketIOClient(`${ipAdress}`);

function ChatScreen({navigation, userInfos,teamInfos}) {
  
    const [currentmessage, setcurrentmessage] = useState();
    const [listMessage , setlistMessage ] = useState([]);
    const [disable, setdisable] = useState(true)
    
    
    useEffect(() => {
            const findMessages = async() => {
            const data = await fetch(`${ipAdress}/chat/message/${teamInfos.teamID}`)
            const body = await data.json()

            setlistMessage(body.messages);
        }
        findMessages() 
      }, []);

      useEffect(() => {
        socket.on('newMessage', (newMessageData) => {
            if (newMessageData.team === teamInfos.teamID && newMessageData.token_author != userInfos.token){
                setlistMessage([...listMessage,newMessageData]);  
            }
            });
      }, [listMessage])


    var handleSubmit = async(messages) => {
        
        if (currentmessage.trim().length > 0){

            socket.emit("sendMessage", messages);
            setlistMessage([...listMessage,{message: currentmessage, author : userInfos.firstname, token_author : userInfos.token, date_of_message: new Date(),picture_Url: userInfos.picture_Url}]);

            setcurrentmessage('')
        }
    }

    var newlistMessage = listMessage.map((msg, i)=>{
        if (userInfos.token == msg.token_author){

            return (
            <View style={{marginRight:10}} key={i}>
                <Badge containerStyle={{marginBottom:-5}} badgeStyle={{backgroundColor: 'transparent', padding:0}} value={<Text style={{color: "grey"}}>{moment(msg.date_of_message).format("LT")}</Text>}/>
                <ListItem.Content style={{borderRadius:10,height: 'auto',padding: 5 ,backgroundColor: '#f79156',marginVertical: 10, marginLeft: 60, flexDirection:"row", justifyContent:'space-between',alignItems:"center", width:'auto'}}>
                    <View  style={{flex:1, marginLeft:10}}>
                    <ListItem.Title style={{color: '#fff'}}>{msg.message}</ListItem.Title>
                    <ListItem.Subtitle style={{color: '#fff', opacity:0.7}}>{msg.author}</ListItem.Subtitle>
                    </View>
                    <View>
                    <Avatar source={{ uri: msg.picture_Url }} avatarStyle={{borderRadius:10}} rounded></Avatar>
                    </View>
                </ListItem.Content>
            </View>
            
            )
                
            
        }else{

        return(
        <View  key={i}>
            <Badge containerStyle={{marginBottom:-5}} badgeStyle={{backgroundColor: 'transparent', padding:0}} value={<Text style={{color: "grey"}}>{moment(msg.date_of_message).format("LT")}</Text>}/>
            <ListItem.Content style={{borderRadius:10, width:'80%',height: 'auto',padding: 5 ,backgroundColor: '#00C3F9',marginVertical: 10, marginLeft: 5, flexDirection:"row", justifyContent:'space-between',alignItems:"center"}}>
                    <Avatar source={{ uri: msg.picture_Url }} avatarStyle={{borderRadius:10}} rounded></Avatar>
                <View style={{flex:1, marginLeft:10}}>
                    <ListItem.Title style={{color: '#fff', position:'relative'}}>{msg.message}</ListItem.Title>
                    <ListItem.Subtitle style={{color: '#fff', opacity:0.7}}>{msg.author}</ListItem.Subtitle>
                </View>
                    </ListItem.Content>
         
        </View>)
        }

      });

    return (
        <View style={{flex:1}}>
        <HeaderComponent navigation={navigation}/>
             <Toast ref={(ref) => Toast.setRef(ref)} />

        <ScrollView  style={{flex:1}}>
            {/* etranger == bleu */}
            
            {newlistMessage}

            

        </ScrollView >

        <KeyboardAvoidingView behavior="padding" enabled>

            <Input
                placeholder='Your message'
                onChangeText={(value) => setcurrentmessage(value) }
                value={currentmessage}
            />
            
            <Button
            
             onPress={() => {
                handleSubmit({message :currentmessage,teamid:teamInfos.teamID,token :userInfos.token,picture_Url: userInfos.picture_Url});
              }
              }
            containerStyle={{width:'100%'}}
                icon={
                    <Icon
                    name="comments"
                    size={20}
                    color="#ffffff"
                    />
                } 
                title="  Envoyer"
                buttonStyle={{backgroundColor: "#FE7235"}}
                type="solid"
            />
        </KeyboardAvoidingView>
        
    </View>
    )
}

function mapStateToProps(state) {
    return { userInfos: state.userInfos, teamInfos: state.teamInfos }
}

export default connect(
    mapStateToProps,
    null
)(ChatScreen);



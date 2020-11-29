import React from 'react';
import { SafeAreaView, View, Text } from 'react-native'
import { Avatar } from 'react-native-elements'
import { DrawerItems } from 'react-navigation-drawer';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons'; 

function MenuComponent({props, userInfos, teamInfos}) {

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ height: 230, justifyContent:'center', alignSelf:'center',alignItems:'center',  marginTop: 10,marginBottom:10}}> 
                <Avatar size='large' rounded source={{ uri: userInfos.picture_Url }} onPress={() => { props.navigation.navigate('ProfilScreen')}} />
                <Text style={{ fontSize: 20, fontStyle:'normal', marginTop: 10,}}>{userInfos.firstname} {userInfos.name}</Text>
                <Text style={{ fontSize: 15, fontStyle:'normal', marginTop: 10,}}>{teamInfos.teamName}</Text>
            </View>
            <DrawerItems {...props} />
            <View style={{height: 200,justifyContent:'flex-end', alignSelf:'center'}} >
            <Ionicons name="ios-log-out" size={24} color="black" onPress={() => { props.navigation.navigate('HomeScreen') }}/>
            </View>
        </SafeAreaView>

    );
}

function mapStateToProps(state) {
    return { userInfos: state.userInfos, teamInfos: state.teamInfos }
}

export default connect(
    mapStateToProps,
    null
)(MenuComponent);

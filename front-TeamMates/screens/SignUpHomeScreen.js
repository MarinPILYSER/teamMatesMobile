import React from 'react';
import {StyleSheet, View, Image} from 'react-native';
import {Text, Button} from 'react-native-elements';
import { AntDesign } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';


function SignUpHomeScreen({navigation}) {
 
    return (
        <View>
            <View style={{alignItems: 'center', zIndex: 1, marginTop: 60}}>
            <AntDesign onPress={() => { navigation.navigate('HomeScreen') }} name="back" size={24} color="black" style={{ position: 'absolute', top: 0, left: 5, zIndex: 1}} />
                <Image
                    style={{width: 100, height: 100, marginBottom: 50}}
                    source={require('../assets/logo_TM_V2.png')}
                />
                <Text h4> BIENVENUE SUR </Text>
                <Text h4 style={{color: '#FE7235'}}> TEAM MATES</Text>
                <View style={{flexDirection: 'row', marginTop: 100}}>
                    <Button onPress={() => { navigation.navigate('SignUpPlayerScreen') }} title="JOUEUR" buttonStyle={{ backgroundColor: "#356DFE", width: 130, height: 52, borderRadius: 10, marginRight: 20}}/>
                    <Button onPress={() => { navigation.navigate('SignUpCoachScreen') }} title="COACH" buttonStyle={{ backgroundColor: "#FE7235", width: 130, height: 52, borderRadius: 10, marginLeft: 20}}/>
                </View>
            </View>
            <Icon style={{marginLeft: 200, zIndex: 0}} size={500} name="circle-thin" color='#00C4F9'/>
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

export default SignUpHomeScreen

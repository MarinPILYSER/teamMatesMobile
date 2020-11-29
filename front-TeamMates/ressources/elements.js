import React from 'react';
import { StyleSheet, Text, View, } from 'react-native';

<View>
    <HeaderComponent navigation={navigation} />

    <Button onPress={() => { navigation.navigate('SignUpHomeScreen') }} title="Inscription" buttonStyle={{ backgroundColor: "#FE7235", width: 167, height: 52 }} containerStyle={{ position: "absolute", top: 400 }} />

</View>

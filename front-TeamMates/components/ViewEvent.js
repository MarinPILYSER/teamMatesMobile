import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, Divider, Avatar } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome';
import { ipAdress } from '../ipAdress.js';
import moment from 'moment';
import { connect } from 'react-redux';
import { Entypo } from '@expo/vector-icons';

function ViewEventComponent({ eventID, teamInfos }) {

    // Update Event, preparation des inputs avec affichage conditionnel
    const [lieu, setLieu] = useState();
    const [date, setDate] = useState()
    const [adversaire, setAdversaire] = useState()
    const [members, setMembers] = useState([])
    const [score_adversaire, setScore_adversaire] = useState(0)
    const [score_local, setScore_local] = useState(0)

    const getEventToUpdate = async (eventID) => {

        const eventToUpdateRaw = await fetch(`${ipAdress}/getEventToUpdate/${eventID}`)
        let response = await eventToUpdateRaw.json()
        if (response.result == true) {
            setDate(response.eventInfos.date_of_event)
            setLieu(response.eventInfos.lieu)
            setAdversaire(response.eventInfos.adversaire)
            setMembers(response.membersInfos.members)
            setScore_adversaire(response.eventInfos.score_adversaire)
            setScore_local(response.eventInfos.score_local)
        }
    };

    useEffect(() => {
        getEventToUpdate(eventID);
    }, []);


    var today = new Date();
    var titulaireComponent = <ScrollView>
        {
            members.map((l, i) => {
                return (
                    <View style={{ display: "flex", flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 10 }}>
                        <Avatar rounded size="medium" containerStyle={{ alignSelf: 'center' }} source={{ uri: l.picture_Url }} />
                        <Text style={{ alignSelf: 'center', fontSize: 20, marginLeft: 20, fontWeight: '500' }} >{l.firstname} {l.name}</Text>
                        <Divider style={{ marginTop: 10, marginBottom: 10, backgroundColor: 'grey' }} />
                    </View>
                )
            })
        }
    </ScrollView>


    return (
        <View style={styles.container}>
            <Text style={{ textAlign: 'center', textAlignVertical: 'center', marginTop: 10 }}> Informations Match</Text>
            <Divider style={{ width: '100%', marginTop: 10, marginBottom: 10 }} />
            <View style={{ marginTop: 10, marginBottom: 30 }}>
                <Text style={styles.title}> Le {moment(date).format('DD/MM')} à {moment(date).format('HH')}h</Text>
                <View style={{flexDirection:'row', alignSelf:'center', justifyContent:'center'}}>
                    <Entypo name="location-pin" size={24} color="#FE7235" />
                    <Text style={{ fontSize: 19, alignSelf: 'center', marginBottom: 10 }}>{lieu} </Text>
                </View>
                <View style={{ flexDirection: 'row', width: '70%', alignItems: 'center', alignSelf: 'center' }}>
                    <Text style={{ marginLeft: 5 }}>{teamInfos.teamName}</Text>
                    <Icon name="caret-left" size={20} color="#F4F4F4" style={{ marginLeft: 5 }} />
                    {(moment(date) < moment(today)) ?
                        <>
                            <Text style={{ marginLeft: 5, color: '#FE7235' }}> {score_local} </Text>
                            <Text> / </Text>
                            <Text style={{ color: '#FE7235' }}> {score_adversaire} </Text>
                        </> : <></>
                    }
                    <Icon name="caret-right" size={20} color="#F4F4F4" style={{ marginLeft: 5 }} />
                    <Text style={{ marginLeft: 5 }}>{adversaire}</Text>
                </View>
            </View>
            {titulaireComponent}
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        height: 200,
        justifyContent: 'flex-start',
    },
    datePickerStyle: {
        alignSelf: "center",
        width: '95%',
        marginTop: 20,
        marginBottom: 20,
    },
    title: {
        fontSize: 25,
        color : '#FE7235',
        textAlign: 'center',
        fontFamily: 'Roboto-Bold',
        marginBottom: 10
    },
    inline: {
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
})

const pickerStyle = {
    inputIOS: {
        color: 'black',
        paddingTop: 13,
        paddingHorizontal: 10,
        paddingBottom: 12,
        backgroundColor: '#FBFBFB',
    },
    inputAndroid: {
        color: 'black',
        backgroundColor: '#FBFBFB',
    },
    placeholderColor: 'black',
    underline: { borderWidth: 1 },


};

function mapStateToProps(state) {
    return { userInfos: state.userInfos, teamInfos: state.teamInfos }
}



export default connect(
    mapStateToProps,
    null
)(ViewEventComponent);

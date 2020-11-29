
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Text, ListItem, Overlay, Button } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome';
import HeaderComponent from '../components/Header';
import CreateEventComponent from '../components/CreateEvent';
import UpdateEventComponent from '../components/UpdateEvent';
import { ipAdress } from '../ipAdress.js';
import { connect } from 'react-redux';
import moment from 'moment';

function TrainingScreen({ navigation, userInfos, teamInfos, setMatch, setMembers }) {
    const [isVisible, setIsVisible] = useState(false);
    const [eventComponent, setEventComponent] = useState(<></>)
    const [listEvents, setListEvents] = useState([])
    const [errorEvent, setErrorEvent] = useState([])


    const fetchTraining = async () => {
        var rawResponse = await fetch(`${ipAdress}/getEventsTraining/${teamInfos.teamID}`);
        var response = await rawResponse.json();
        if (response.result) {
            if (response.allEvents) {
                let allEvents = response.allEvents.sort(function compare(a, b) {
                    if (a.date_of_event < b.date_of_event)
                       return -1;
                    if (a.date_of_event > b.date_of_event )
                       return 1;
                    return 0;
                  });
                setListEvents(allEvents)
              }
            setIsVisible(false)
        } else {
            setErrorEvent(response.error)
        }
    }
    useEffect(() => {
        fetchTraining()
    }, []);

    const ModifyTraining = (eventID) => {
        setEventComponent(<UpdateEventComponent eventID={eventID} getEvents={fetchTraining} />)
        setIsVisible(!isVisible);
    };

    const CreateTraining = () => {
        setEventComponent(<CreateEventComponent getEvents={fetchTraining} />)
        setIsVisible(!isVisible);
    };

    const deleteEvent = async (eventID) => {
        var rawResponse = await fetch(`${ipAdress}/deleteEvent/${eventID}`);
        var response = await rawResponse.json();
        if (response.result == true) {
            fetchTraining();
        }
    }

    const createTwoButtonAlert = (eventID) =>
        Alert.alert(
            "Êtes-vous sûr de vouloir supprimer cet événement ?","",
            [
                {
                    text: "Annuler",
                    onPress: () => {},
                    style: "cancel"
                },
                { text: "Supprimer", onPress: () => deleteEvent(eventID) }
            ],
            { cancelable: false }
        );


    let oneEvent = listEvents.map((training, i) => {
        if (training.recurrence == false) {
            return (
                <ListItem key={i} bottomDivider style={{ width: '90%', alignSelf: 'center' }}>
                    <ListItem.Content style={{ flexDirection: 'row', borderLeftWidth: 8, borderLeftColor: '#1DAA1A' }}>

                        <ListItem.Title style={{ marginRight: 'auto', paddingLeft: 10 }}>
                            <Text>Le {moment(training.date_of_event, "YYYY-MM-DD").format('LL')}
                            {"\n"}{training.lieu}
                            </Text>
                            <Text style={{fontStyle: 'italic', color:'grey', width:30}}>
                            {"\n"}{training.commentaires}
                            </Text>
                        </ListItem.Title>
                        {userInfos.admin ?
                            <View style={{ flexDirection: 'row', alignSelf: 'flex-start' }}>

                                <TouchableOpacity style={{ marginRight: 15 }}>

                                    <Icon
                                        name="pencil"
                                        size={20}
                                        color="#000000"
                                        onPress={() => ModifyTraining(training._id)}
                                    />

                                </TouchableOpacity>

                                <TouchableOpacity>

                                    <Icon
                                        name="trash-o"
                                        size={20}
                                        color="#000000"
                                        onPress={() => createTwoButtonAlert(training._id)}
                                    />

                                </TouchableOpacity>

                            </View>
                            : <></>}
                    </ListItem.Content>

                </ListItem>)
        }
    })

    let manyEvent = listEvents.map((training, i) => {
        if (training.recurrence == true) {
            return (
                <ListItem key={i} bottomDivider style={{ width: '90%', alignSelf: 'center' }}>
                    <ListItem.Content style={{ flexDirection: 'row', borderLeftWidth: 8, borderLeftColor: '#1DAA1A' }}>

                        <ListItem.Title style={{ marginRight: 'auto', paddingLeft: 10 }}>
                            <Text>Tous les {moment(training.date_of_event, "YYYY-MM-DD").format('dddd')} 
                            {"\n"}{training.lieu}</Text>
                            <Text style={{fontStyle: 'italic', color:"grey", paddingRight: 30}}>
                            {"\n"}{training.commentaires}
                            </Text>
                        </ListItem.Title>
                        {userInfos.admin ?
                            <View style={{ flexDirection: 'row', alignSelf: 'flex-start' }}>

                                <TouchableOpacity style={{ marginRight: 15 }}>

                                    <Icon
                                        name="pencil"
                                        size={20}
                                        color="#000000"
                                        onPress={() => ModifyTraining(training._id)}
                                    />

                                </TouchableOpacity>

                                <TouchableOpacity>

                                    <Icon
                                        name="trash-o"
                                        size={20}
                                        color="#000000"
                                        onPress={() => createTwoButtonAlert(training._id)}
                                    />

                                </TouchableOpacity>

                            </View>
                            : <></>}
                    </ListItem.Content>

                </ListItem>)
        }
    })


    return (

        <View style={{ flex: 1 }}>
            <HeaderComponent navigation={navigation} hideButton={true} />
            <ScrollView style={styles}>
                {userInfos.admin ? <Button title="Ajouter un évènement" titleStyle={{ color: 'black', fontSize: 15, fontWeight: 'bold', marginLeft: 10 }} icon={<Icon name="plus"/>} buttonStyle={{backgroundColor: 'transparent'}} containerStyle={{alignSelf: 'center', marginTop: 10, marginBottom: 10}} onPress={CreateTraining} /> : <></>}
                {(listEvents.length!=0) ?
         
          <View>
                    <Text h4 style={{ textAlign: 'center', marginTop: 30, marginBottom: 20 }}>Prochains entrainements</Text>
                    <View style={{ width: '90%', alignSelf: 'center' }}>
                        <Text style={{ marginTop: 30, marginBottom: 10 }}>Ponctuels</Text>
                    </View>
                    {oneEvent}
                    {errorEvent}

                    <View style={{ width: '90%', alignSelf: 'center' }}>
                        <Text style={{ marginTop: 30, marginBottom: 10 }}>Hebdomadaires</Text>
                    </View>
                    {manyEvent}

                </View> : <Text h4 style={{ textAlign: 'center', marginTop: 50, marginBottom: 20, fontStyle:'italic' }}>Aucun Entraînement</Text>}


                <Overlay overlayStyle={{ height: 700, width: '80%', borderRadius: 20 }} isVisible={isVisible} onBackdropPress={() => {setMatch([]);setMembers([]);setIsVisible(false)}}>
                    {eventComponent}
                </Overlay>

            </ScrollView>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

function mapStateToProps(state) {
    return { userInfos: state.userInfos, teamInfos: state.teamInfos }
}

function mapDispatchToProps(dispatch) {
    return {
        setMembers: function (membersToUpdate) {
            dispatch({ type: 'majMembersToUpdate', membersToUpdate })
        },
        setMatch: function (membersMatch) {
            dispatch({ type: 'majMembers', membersMatch })
        }
    }
  }
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TrainingScreen);

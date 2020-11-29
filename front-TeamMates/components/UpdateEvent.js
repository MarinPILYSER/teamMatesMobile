import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { Text, Button, Divider, Input } from 'react-native-elements'

import SwitchSelector from 'react-native-switch-selector';
import UpdateTitulairesList from './UpdateTitulairesList';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import RNPickerSelect from 'react-native-picker-select';
import { ipAdress } from '../ipAdress.js';
import moment from 'moment';
import { connect } from 'react-redux';

function UpdateEventComponent({ teamInfos, eventID, getEvents, setMembers, setMatch, membersMatch }) {

    // Pour l'input date (j'ai suivi la doc)
    const [visible, setvisible] = useState(false)

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const toggleDatePicker = () => {
        setvisible(false);
        if (visible == false) {
            setDatePickerVisibility(!isDatePickerVisible);
            setvisible(true);

        }
    };
    const handleConfirm = (date) => {
        setDate(date)
        toggleDatePicker();
        setDatePickerVisibility(!isDatePickerVisible)
        setvisible(true)
    };

    const [error, setError] = useState([]);
    const [loading, setLoading] = useState(<></>);
    // Update Event, preparation des inputs avec affichage conditionnel
    const [eventType, setEventType] = useState("");
    const [initial, setInitial] = useState(0)
    const [recurrence, setRecurrence] = useState()
    const [lieu, setLieu] = useState();
    const [lieuBDD, setLieuBDD] = useState();
    const [date, setDate] = useState()
    const [adversaire, setAdversaire] = useState()
    const [adversaireBDD, setAdversaireBDD] = useState()
    const [commentaire, setCommentaire] = useState()
    const [commentaireBDD, setCommentaireBDD] = useState()
    const [scoreLocal, setScoreLocal] = useState(0)  
    const [scoreAdversaire, setScoreAdversaire] = useState(0)
    const [scoreLocalBDD, setScoreLocalBDD] = useState(0)
    const [scoreAdversaireBDD, setScoreAdversaireBDD] = useState(0)

    // Récuperation des infos de l'event, (faire passer en props l'id de l'event au clic sur le pencil du composant parent)
    const getEventToUpdate = async (eventID) => {

        const eventToUpdateRaw = await fetch(`${ipAdress}/getEventToUpdate/${eventID}`)
        let response = await eventToUpdateRaw.json()
        if (response.result == true) {
            if (response.eventInfos.recurrence == true){
                setInitial(1)}
                setRecurrence(response.eventInfos.recurrence)           
                setDate(response.eventInfos.date_of_event)
                setLieu(response.eventInfos.lieu)
                setAdversaire(response.eventInfos.adversaire)
                setAdversaireBDD(response.eventInfos.adversaire)
                setCommentaire(response.eventInfos.commentaires) 
                setCommentaireBDD(response.eventInfos.commentaires) 
                setScoreLocal(response.eventInfos.score_local) 
                setScoreLocalBDD(response.eventInfos.score_local) 
                setScoreAdversaire(response.eventInfos.score_adversaire) 
                setScoreAdversaireBDD(response.eventInfos.score_adversaire) 
                setLieu(response.eventInfos.lieu)
                setLieuBDD(response.eventInfos.lieu)
                setEventType(response.eventInfos.category)
                setMatch(response.eventInfos.members)
                setMembers(response.eventInfos.members)
                
                
        } else {
            setError(response.error)
        }
    };

    useEffect(() => {
        getEventToUpdate(eventID);
    }, []);

    var recurrenceOptions = [{ label: 'Ponctuel', value: false }, { label: 'Hebdomadaire', value: true }];
    var Input1 = <></>
    var Input2 = <></>
    var button = <></>
    var score = <></>

    if (eventType === "Entraînement") {
        Input1 = <Input multiline={true} numberOfLines={4} placeholder={commentaireBDD} onChangeText={(val) => setCommentaire(val)} />
        Input2 = <SwitchSelector options={recurrenceOptions} initial={initial} onPress={value => setRecurrence(value)} buttonColor='#FE7235' hasPadding={true} />
        button = <Button title="Mettre à jour l'entraînement" onPress={() => { updateEvent(eventID) }} titleStyle={{ color: 'black', fontSize: 15, fontWeight: '500' }} buttonStyle={{ backgroundColor: "#ffffff", borderBottomWidth: 1, borderColor: 'black', marginTop: 20, }} containerStyle={{ alignSelf: 'center', marginBottom: 20 }} />
    } 
    else if (eventType === "Match") {
        Input1 = <Input onChangeText={(value) => setAdversaire(value)} placeholder={adversaireBDD} />
        Input2 = <UpdateTitulairesList />
        score = <View style={{ flexDirection: 'row' }}>
            <Input placeholder={scoreLocalBDD.toString()} keyboardType={'numeric'} inputStyle={{ textAlign: 'center' }} containerStyle={{ width: '40%' }} onChangeText={(val) => setScoreLocal(val)} />
            <Input placeholder={scoreAdversaireBDD.toString()} keyboardType={'numeric'} inputStyle={{ textAlign: 'center' }} containerStyle={{ width: '40%' }} onChangeText={(val) => setScoreAdversaire(val)} />
        </View>
        button = <Button title="Mettre à jour le match" onPress={() => { temp(eventID) }} titleStyle={{ color: 'black', fontSize: 15, fontWeight: '500' }} buttonStyle={{ backgroundColor: "#ffffff", borderBottomWidth: 1, borderColor: 'black', marginTop: 20 }} containerStyle={{ alignSelf: 'center', marginBottom: 20 }} />
    }
    // Au clic sur le bouton Mettre à jour, envoi des infos dans le back

    const temp = (eventID) => {
        // const timer = setTimeout(() => {
            updateEvent(eventID)
        // }, 500);
        // return () => clearTimeout(timer);

    }
    var createActu = async () => {
        var event = "événement"
        var dateOfEvent = ""
        if (eventType == "Entraînement") {
            event = "Entraînement"
        } else if (eventType == "Match") {
            event = "Match"
        }
        if (recurrence) {
            dateOfEvent = `tous les ${moment(date, "DD-MM-YYYY").format('dddd')}`
        } else {
            dateOfEvent = `le ${moment(date, "DD-MM-YYYY").format('LL')}`
        }
        var rawResponse = await fetch(`${ipAdress}/newActu/${teamInfos.teamID}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `text=${event} mis à jour pour le ${dateOfEvent} à ${lieu}`
        })
        var response = await rawResponse.json();

    }

    const updateEvent = async (eventID) => {
        var goodDate = moment(date, "YYYY-MM-DD HH:mm:ss").utc();
        setLoading(<View style={{ marginTop: 5 }}><ActivityIndicator size="small" color="#0000ff" /></View>)
        var rawResponse = await fetch(`${ipAdress}/updateEvent/${eventID}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `category=${eventType}&lieu=${lieu}&recurrence=${recurrence}&date=${JSON.stringify(goodDate)}&adversaire=${adversaire}&commentaire=${commentaire}&titulairesList=${JSON.stringify(membersMatch)}&score_local=${scoreLocal}&score_adversaire=${scoreAdversaire}`
        })

        var response = await rawResponse.json();
        if (response.result == true) {
            getEvents();
            setMatch([]);
            setMembers([]);
            createActu()
        } else {
            setLoading(<></>)
            setError(response.error)
        }
    }
    return (
        <View style={styles.container}>
            
            <Text style={{ textAlign: 'center', textAlignVertical: 'center', marginTop: 10 }}>Modifier l'évènement</Text>

            <Divider style={{ width: '100%', marginTop: 10, marginBottom: 10 }} />

            <RNPickerSelect
                placeholder={{
                    label: "Sélectionner un type d'évenement",
                    value: null,
                    color: 'grey',
                }}
                style={pickerStyle}
                inputIOSContainer={styles.pickerSelectStyles}
                value={eventType}
                onValueChange={(value) => setEventType(value)}
                items={[
                    { label: 'Entraînement', value: 'Entraînement' },
                    { label: 'Match', value: 'Match' },
                ]}
            />

            <Input placeholder={moment(date).format("DD/MM/YYYY")} onFocus={toggleDatePicker} />
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="datetime"
                locale="en_FR"
                onConfirm={handleConfirm}
                onCancel={toggleDatePicker}
            />

            <Input onChangeText={(value) => setLieu(value)} placeholder={lieuBDD} />
            {Input1}{score}<Text style={{color: 'red', marginBottom: 10}} >{error}</Text>{Input2}{button}{loading}
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        height: 300,
        justifyContent: 'flex-start',
    },
    datePickerStyle: {
        alignSelf: "center",
        width: '95%',
        marginTop: 20,
        marginBottom: 20,
    }
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
    return { eventInfos: state.eventInfos, membersMatch: state.membersMatch, teamInfos: state.teamInfos }
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
)(UpdateEventComponent);

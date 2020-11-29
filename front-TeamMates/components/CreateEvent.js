import React, { useState } from 'react';
import { StyleSheet, View, ActivityIndicator} from 'react-native';
import { Text, Button, Divider, Input } from 'react-native-elements'
import SwitchSelector from 'react-native-switch-selector';
import TitulairesList from './TitulairesList';
import RNPickerSelect from 'react-native-picker-select';
import moment from 'moment';
import 'moment/locale/fr'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { connect } from 'react-redux';
import { ipAdress } from '../ipAdress.js';

function CreateEventComponent({ teamInfos, getEvents, membersMatch }) {

    const [loading, setLoading] = useState(<></>);
    const [visible, setvisible] = useState(false)
    // Pour l'input date (j'ai suivi la doc)
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

    const [eventType, setEventType] = useState('');
    const [recurrence, setRecurrence] = useState(false)
    const [date, setDate] = useState(new Date())
    const [place, setPlace] = useState('')
    const [opponent, setOpponent] = useState('')
    const [comment, setComment] = useState('')
    const [scoreLocal, setScoreLocal] = useState(0)
    const [scoreAdversaire, setScoreAdversaire] = useState(0)
    const [errorEvent, setErrorEvent] = useState([]);

    var createActu = async () => {
        var event = "événement"
        var dateOfEvent = ""
        if (eventType == "Entraînement") {
            event = "Nouvel entraînement"
        } else if (eventType == "Match") {
            event = "Nouveau match"
        }
        if (recurrence) {
            dateOfEvent = `tous les ${moment(date, "DD-MM-YYYY").format('dddd')}`
        } else {
            dateOfEvent = `le ${moment(date, "DD-MM-YYYY").format('LL')}`
        }
        var rawResponse = await fetch(`${ipAdress}/newActu/${teamInfos.teamID}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `text=${event} prévu ${dateOfEvent} à ${place}`
        })
        var response = await rawResponse.json();

    }

    var handleSubmitEvent = async () => {
        // Bouton tournant loading 
        setLoading(<View style={{ marginTop: 5 }}><ActivityIndicator size="small" color="#0000ff" /></View>)
        var goodDate = moment(date, "YYYY-MM-DD HH:mm:ss").utc();
        var rawResponse = await fetch(`${ipAdress}/newEvent`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `members=${JSON.stringify(membersMatch)}&eventType=${eventType}&recurrence=${recurrence}&date=${JSON.stringify(goodDate)}&place=${place}&opponent=${opponent}&comment=${comment}&teamID=${teamInfos.teamID}&score_local=${scoreLocal}&score_adversaire=${scoreAdversaire}`
        })
        var response = await rawResponse.json();
        if (response.result === true) {
            setLoading(<></>);
            getEvents()
            createActu()
        } else {
            setLoading(<></>)
            setErrorEvent(response.error)
        }
    }

    var recurrenceOptions = [{ label: 'Ponctuel', value: false }, { label: 'Hebdomadaire', value: true }];
    var Input1 = <></>
    var Input2 = <></>
    var Input3 = <></>
    var Input4 = <></>
    var button = <></>

    if (eventType === "Entraînement") {
        Input1 = <Input multiline={true} numberOfLines={4} placeholder="Ajouter un commentaire" onChangeText={(value) => setComment(value)} />
        Input2 = <SwitchSelector options={recurrenceOptions} initial={0} onPress={value => setRecurrence(value)} buttonColor='#FE7235' hasPadding={true} />
        button = <Button onPress={() => { handleSubmitEvent() }} title="Créer un entraînement" titleStyle={{ color: 'black', fontSize: 15, fontWeight: '500' }} buttonStyle={{ backgroundColor: "#ffffff", borderBottomWidth: 1, borderColor: 'black', marginTop: 20, }} containerStyle={{ alignSelf: 'center', marginBottom: 20, }} />

    } else if (eventType === "Match") {
        Input1 = <Input placeholder='Adversaire' onChangeText={(value) => setOpponent(value)} />
        Input2 = <TitulairesList />
        button = <Button onPress={() => { handleSubmitEvent() }} title="Créer un match" titleStyle={{ color: 'black', fontSize: 15, fontWeight: '500' }} buttonStyle={{ backgroundColor: "#ffffff", borderBottomWidth: 1, borderColor: 'black' }} containerStyle={{ alignSelf: 'center', marginBottom: 20, }} />
    }

    return (
        <View style={styles.container}>
            <Text style={{ textAlign: 'center', textAlignVertical: 'center', marginTop: 10 }}>Créer un évènement</Text>

            <Divider style={{ width: '100%', marginTop: 10, marginBottom: 10 }} />

            <RNPickerSelect
                placeholder={{
                    label: "Sélectionner un type d'évenement",
                    value: null,
                    color: 'grey',
                }}
                style={pickerStyle}
                inputIOSContainer={styles.pickerSelectStyles}
                selectedValue={eventType}
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
            <Input placeholder='Lieu' onChangeText={(value) => setPlace(value)} />
            {Input1}<View style={{ flexDirection: 'row' }}>{Input3}{Input4}
                <Text style={{ color: 'red', marginBottom: 10 }}>{errorEvent}</Text></View>{Input2}{button}{loading}


        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        marginTop: 20,
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
    return { teamInfos: state.teamInfos, membersMatch: state.membersMatch }
}

export default
    connect(
        mapStateToProps,
        null
    )(CreateEventComponent);
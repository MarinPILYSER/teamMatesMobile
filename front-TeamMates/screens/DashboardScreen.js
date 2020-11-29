import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Button } from 'react-native-elements'
import HeaderComponent from '../components/Header';
import { Avatar, Image, Overlay } from 'react-native-elements'
import { Divider } from 'react-native-elements';
import CreatePostComponent from '../components/CreatePost';
import { connect } from 'react-redux';
import { Calendar } from 'react-native-calendars';
import { ipAdress } from '../ipAdress.js'
import { Video } from 'expo-av';
import { withNavigationFocus } from 'react-navigation';
import moment from 'moment';

function DashboardScreen({ navigation, userInfos, teamInfos, isFocused }) {

    const [isVisible, setIsVisible] = useState(false);
    const [overlayComponent, setOverlayComponent] = useState(<></>)
    const [currentDate, setCurrentDate] = useState('');
    const [event, setEvent] = useState([]);
    const [nextMatch, setNextMatch] = useState(false);
    const [obj, setObj] = useState({})
    const [nbActus, setNbActus] = useState(5)

    // Lorsque isFocused
    const [ok, setOk] = useState(true);

    // Liste Actu
    const [listeActu, setListeActu] = useState([])

    const getEvents = async () => {
        const allEventsRaw = await fetch(`${ipAdress}/getEvents/${teamInfos.teamID}`)
        let response = await allEventsRaw.json()
        setEvent(response.allEvents)
    }

    const getNextMatch = async () => {
        const responseRaw = await fetch(`${ipAdress}/getEventsMatch/${teamInfos.teamID}`)
        let response = await responseRaw.json()
        if(response.lastMatch){
        setNextMatch(response.lastMatch)
        }
    }

    const getActus = async () => {
        const allActuRaw = await fetch(`${ipAdress}/getActus/${teamInfos.teamID}/${nbActus}`)
        let response = await allActuRaw.json()
        setListeActu(response.listeActu)
        setIsVisible(false);
    }

    // RECUPERATION DES ACTUS
    useEffect(() => {

        // Pour récupérer la date du jour au bon format
        var ajd = moment().format('DD/MM/YYYY')
        setCurrentDate(ajd)
        getActus()
        getEvents()
        getNextMatch()
    }, [ok, nbActus])


if (isFocused && ok) {
    setOk(false)
}
if (!isFocused && !ok) {
    setOk(true)
    setNbActus(5)
}


// Chargement Actus supplémentaires
const moreActus = async () => {
    setNbActus(nbActus + 5);
}

useEffect(() => {
    let tmpObj = {};
    event.map((e, i) => {
        let date = moment(e.date_of_event).format('YYYY-MM-DD')
        if (e.category === 'Match') {
            tmpObj = { ...tmpObj, [date]: { marked: true, dotColor: 'red', activeOpacity: 0 } }
        } else if (e.category === 'Entraînement') {
            tmpObj = { ...tmpObj, [date]: { marked: true, dotColor: 'blue', activeOpacity: 0 } }
        }  
    });
    setObj(tmpObj)
}, [event])

const createPost = () => {
    setOverlayComponent(<CreatePostComponent getActus={getActus} />)
    setIsVisible(true);
};


// Condition pour display des actu que si il y en a, et condition pour display les photos que sur les actus où il y en a
var ActuComponent

if (!listeActu) {
    ActuComponent = <Text style={{ marginTop: 30, fontStyle: 'italic' }}> Aucune actualité disponible.</Text>
} else {
    ActuComponent =
        <View style={{ marginTop: 40, marginBottom: 40 }}>
            {
                listeActu.map((l, i) => {
                    if (l.media_url.length > 0) {
                        if (l.mediaType == "image") {
                            var thumbnail = <Image source={{ uri: l.media_url }} style={{ width: 35, height: 35, marginTop: 5 }} />
                            var media = <Image source={{ uri: l.media_url }} style={{ width: 35, height: 350, width: 350 }} />
                        } else if (l.mediaType == "video") {
                            var thumbnail = <Video source={{ uri: l.media_url }} rate={1.0} volume={1.0} isMuted={false} resizeMode="cover" isLooping style={{ width: 35, height: 35 , marginTop: 5}} />
                            var media = <Video source={{ uri: l.media_url }} rate={1.0} volume={1.0} useNativeControls isMuted={false} resizeMode="cover" shouldPlay isLooping style={{ width: 350, height: 350 }} />
                        }
                        return (
                            <View key={i} style={styles.actu}>
                                <View style={{ display: "flex", flexDirection: 'row', justifyContent: "flex-start" }}>
                                    <Text style={{ fontWeight: '500' }}>
                                        {l.contenu}
                                    </Text>
                                </View>
                                <TouchableOpacity onPress={() => { setIsVisible(true); setOverlayComponent(media) }}>
                                    {thumbnail}
                                </TouchableOpacity>
                                <Divider style={{ marginTop: 10, marginBottom: 10, backgroundColor: 'grey' }} />
                            </View>
                        )
                    } else {
                        return (
                            <View key={i} style={styles.actu}>
                                <View style={{ display: "flex", flexDirection: 'row', justifyContent: "flex-start" }}>
                                    <Text style={{ fontWeight: '500' }}>{l.contenu}</Text>
                                </View>
                                <Divider style={{ marginTop: 10, marginBottom: 10, backgroundColor: 'grey' }} />
                            </View>
                        )
                    }
                })
            }
            <Button title="Charger plus d'actualités" type="clear" titleStyle={{ color: 'grey', fontSize: 12 }} buttonStyle={{ backgroundColor: '#F4F4F4', borderRadius: 20, }} containerStyle={{ alignSelf: 'center', marginBottom: 20, marginTop: 20 }} onPress={() => moreActus()} />
        </View>
}

let dateNextMatch = moment(nextMatch.date_of_event).format('DD/MM')
let timeNextMatch = moment(nextMatch.date_of_event).format('HH')

return (
    <View style={styles.container}>
        <HeaderComponent navigation={navigation} />
        <ScrollView>
            {nextMatch ?
            <View style={{ marginTop: 30 }}>
                <Text style={styles.title}> Prochaine rencontre :</Text>
                <Text style={styles.subtitle}> Prévu le : {dateNextMatch} à {timeNextMatch}h</Text>
                <View style={styles.inline}>
                    <Text style={styles.alignSelf}> {teamInfos.teamName} - {nextMatch.adversaire} </Text>
                </View>
            </View> : <></>}
            <View style={{ marginTop: 30, width: '90%', justifyContent: 'center', alignSelf: 'center' }}>
                <Calendar
                    current={currentDate}
                    minDate={'1000-01-01'}
                    maxDate={'3000-01-01'}
                    hideExtraDays={true}
                    firstDay={1}
                    markedDates={obj}
                    hideDayNames={true}
                    disableAllTouchEventsForDisabledDays={true}
                    style={{ alignSelf: 'center', width: '100%' }}
                />
            </View>

            <View style={{ marginTop: 30, flexDirection: "row", width: '90%', justifyContent: 'center', alignSelf: 'center' }}>
                <Button title="Mes matchs" titleStyle={{ color: 'white', fontSize: 15, fontFamily: 'Roboto-Regular', }} buttonStyle={{ backgroundColor: userInfos.admin ? "#FE7235" : "#3893DC", height: 50, borderRadius: 40 }} containerStyle={{ width: '50%', marginRight: 10 }} onPress={() => { navigation.navigate('MatchScreen') }} />
                <Button title="Mes entraînements" titleStyle={{ color: 'white', fontSize: 15, fontFamily: 'Roboto-Regular', }} buttonStyle={{ backgroundColor: userInfos.admin ? "#FE7235" : "#3893DC", height: 50, borderRadius: 40 }} containerStyle={{ width: '50%', marginLeft: 10 }} onPress={() => { navigation.navigate('TrainingScreen') }} />
            </View>
            <View style={{ marginTop: 30, width: '90%', justifyContent: 'center', alignSelf: 'center' }}>
                <Text style={styles.title}> À la une:</Text>
                {userInfos.admin ?
                    <View style={styles.inline}>
                        <Avatar rounded containerStyle={{ marginRight: 10, }} source={{ uri: userInfos.picture_Url }} />
                        <Button title="Partagez une publication..." titleStyle={{ color: 'black', fontSize: 12, fontStyle: "italic" }} buttonStyle={{ backgroundColor: "#F4F4F4", width: 250, height: 33, borderRadius: 40, color: "black" }} onPress={createPost} />
                    </View> : <></>}
            </View>
            <Overlay overlayStyle={{ borderRadius: 20, alignSelf: 'center' }} isVisible={isVisible} onBackdropPress={() => setIsVisible(false)}>
                {overlayComponent}
            </Overlay>
            {ActuComponent}
        </ScrollView>
    </View>
)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: "flex-start",
        backgroundColor: "white",
    },
    logo: {
        width: 66,
        height: 58,
    },
    inline: {
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    actu: {
        display: "flex",
        flexDirection: 'column',
        marginRight: 10,
        marginLeft: 10,
    },
    alignSelf: {
        alignSelf: 'center',
    },
    title: {
        fontSize: 20,
        textAlign: 'center',
        fontFamily: 'Roboto-Bold',
    },
    subtitle: {
        fontSize: 15,
        textAlign: 'center',
    },
});

function mapStateToProps(state) {
    return { userInfos: state.userInfos, teamInfos: state.teamInfos }
}

export default connect(
    mapStateToProps,
 null
)(withNavigationFocus(DashboardScreen));
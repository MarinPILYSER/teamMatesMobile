import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Text, ListItem, Card, Overlay, Button } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome';
import { Ionicons } from '@expo/vector-icons';
import HeaderComponent from '../components/Header';
import CreateEventComponent from '../components/CreateEvent';
import UpdateEventComponent from '../components/UpdateEvent';
import ViewEventComponent from '../components/ViewEvent';
import { connect } from 'react-redux';
import { ipAdress } from '../ipAdress.js';
import moment from 'moment';

function MatchScreen({ navigation, userInfos, teamInfos, setMatch, setMembers }) {

  const [isVisible, setIsVisible] = useState(false);
  const [eventComponent, setEventComponent] = useState(<></>)
  const [errorEvent, setErrorEvent] = useState([])
  const [matchPast, setMatchPast] = useState([])
  const [matchFutur, setMatchFutur] = useState([])

  const fetchMatch = async () => {
    var rawResponse = await fetch(`${ipAdress}/getEventsMatch/${teamInfos.teamID}`);
    var response = await rawResponse.json();
    if (response.result) {
      if (response.allEvents) {
        let tmpMatchPast = [];
        let tmpMatchFutur = [];
        var today = new Date();
        response.allEvents.map((match, i) => {
          if (moment(match.date_of_event).utc() < moment(today).utc()) {
            tmpMatchPast.push(match);
          }
        }
        );
       
        tmpMatchPast.sort(function compare(a, b) {
          if (a.date_of_event > b.date_of_event)
             return -1;
          if (a.date_of_event < b.date_of_event )
             return 1;
          return 0;
        });
        setMatchPast(tmpMatchPast);
        response.allEvents.map((match, i) => {
          if (moment(match.date_of_event).utc() >= moment(today).utc()) {
            tmpMatchFutur.push(match);
          }
        }
        );
        tmpMatchFutur.sort(function compare(a, b) {
          if (a.date_of_event < b.date_of_event)
             return -1;
          if (a.date_of_event > b.date_of_event )
             return 1;
          return 0;
        });
        setMatchFutur(tmpMatchFutur);
        setIsVisible(false);
      } else {
        setErrorEvent(response.error);
      }
    }
  }

  useEffect(() => {
    fetchMatch()
  }, []);

  const ViewGame = (eventID) => {
    setEventComponent(<ViewEventComponent eventID={eventID} />)
    setIsVisible(!isVisible)
  }

  const ModifyGame = (eventID) => {
    setEventComponent(<UpdateEventComponent eventID={eventID} getEvents={fetchMatch} />)
    setIsVisible(!isVisible);
  };

  const CreateGame = () => {
    setEventComponent(<CreateEventComponent getEvents={fetchMatch} />)
    setIsVisible(!isVisible);
  };

  const deleteEvent = async (eventID) => {
    var rawResponse = await fetch(`${ipAdress}/deleteEvent/${eventID}`);
    var response = await rawResponse.json();
    if (response.result == true) {
      fetchMatch()
    }
  }

  const createTwoButtonAlert = (eventID) =>
    Alert.alert(
      "Êtes-vous sûr de vouloir supprimer cet événement ?", "",
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

  let futur = <Text style={{ textAlign: 'center', marginTop: 50, marginBottom: 20, fontStyle: 'italic' }}>Aucun match à venir</Text>

  if (matchFutur.length != 0) {
    futur = matchFutur.map((match, i) => {
      return (
        <ListItem key={i} bottomDivider style={{ width: '90%', alignSelf: 'center' }}>
          <ListItem.Content style={{ flexDirection: 'row', borderLeftWidth: 8, borderLeftColor: '#1DAA1A' }}>

            <ListItem.Title style={{ marginRight: 'auto', paddingLeft: 10 }}>
              <Text>Le {moment(match.date_of_event, "YYYY-MM-DD").format('LL')}
                {"\n"}{match.lieu}
                {"\n"}contre {match.adversaire}</Text>
            </ListItem.Title>
            {userInfos.admin ?

              <View style={{ flexDirection: 'row', alignSelf: 'flex-start' }}>

                <TouchableOpacity style={{ marginRight: 15 }}>

                  <Icon
                    name="pencil"
                    size={20}
                    color="#000000"
                    onPress={() => ModifyGame(match._id)}
                  />

                </TouchableOpacity>

                <TouchableOpacity>

                  <Icon
                    name="trash-o"
                    size={20}
                    color="#000000"
                    onPress={() => createTwoButtonAlert(match._id)}
                  />

                </TouchableOpacity>

              </View>
              : <Ionicons name="ios-eye" size={20} color="black" onPress={() => ViewGame(match._id)} />
            }

          </ListItem.Content>

        </ListItem>
      )
    })
  }


  let past = <></>

  if (matchPast.length != 0) {
    past = <>
    <Text h4 style={{ textAlign: 'center', marginTop: 50, marginBottom: 20 }}>Anciens matchs</Text>
    <Card containerStyle={{ borderColor: 'transparent', shadowColor: 'white', elevation: 0 }}>
      {matchPast.map((match, i) => {
        return (
          <View>
            <Card.Title style={{ backgroundColor: '#F4F4F4', padding: 5 }}>{moment(match.date_of_event).format("DD/MM/YYYY")}</Card.Title>
            <View style={{ flex: 1, alignSelf: 'center', marginBottom: 10 }}>
              <View style={{ flexDirection: 'row', width: '70%', alignItems: 'center', alignSelf: 'center' }}>
                <Text style={{ marginLeft: 5, fontSize:17 }}>{teamInfos.teamName}</Text>
                <Icon name="caret-left" size={20} color="#F4F4F4" style={{ marginLeft: 5 }} />
                <Text style={{ marginLeft: 5, color: '#FE7235', fontSize:17 }}> {match.score_local} </Text>
                <Text> - </Text>
                <Text style={{ color: '#FE7235' , fontSize:17}}> {match.score_adversaire} </Text>
                <Icon name="caret-right" size={20} color="#F4F4F4" style={{ marginLeft: 5 }} />
                <Text style={{ marginLeft: 5, fontSize:17 }}>{match.adversaire}</Text>
              </View>
              <View style={{ marginTop: 15, alignSelf: 'center' }}>
                {userInfos.admin ?
                  <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
                    <TouchableOpacity style={{ marginRight: 15 }}>
                      <Icon name="pencil" size={20} color="#000000" onPress={() => ModifyGame(match._id)} />
                    </TouchableOpacity>
                    <TouchableOpacity>

                      <Icon
                        name="trash-o"
                        size={20}
                        color="#000000"
                        onPress={() => createTwoButtonAlert(match._id)}
                      />

                    </TouchableOpacity>
                  </View>
                  : <Ionicons name="ios-eye" size={20} color="black" onPress={() => ViewGame(match._id)} />}

              </View>
            </View>
          </View>
        )
      })
      }
    </Card>
    </>
  }

  return (

    <View style={{ flex: 1 }}>
      <HeaderComponent navigation={navigation} hideButton={true} />
      <ScrollView style={{ marginBottom: 20 }}>
        {userInfos.admin ? <Button title="Ajouter un évènement" titleStyle={{ color: 'black', fontSize: 15, fontWeight: 'bold', marginLeft: 10 }} icon={<Icon name="plus" />} buttonStyle={{ backgroundColor: 'transparent' }} containerStyle={{ alignSelf: 'center', marginTop: 10, marginBottom: 10 }} onPress={() => CreateGame()} /> : <></>}


        <View>
          <Text h4 style={{ textAlign: 'center', marginTop: 30, marginBottom: 20 }}>Matchs prévus</Text>
          {futur}
          {errorEvent}
        </View>

       

        {past}

        <Overlay overlayStyle={{ height: 700, width: '80%', borderRadius: 20 }} isVisible={isVisible} onBackdropPress={() => { setMatch([]); setMembers([]); setIsVisible(false) }}>
          {eventComponent}
        </Overlay>
      </ScrollView>
    </View>
  );
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
)(MatchScreen)

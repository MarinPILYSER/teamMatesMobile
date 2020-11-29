import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { Text, Divider, CheckBox, Avatar } from 'react-native-elements'
import { connect } from 'react-redux';
import { ipAdress } from '../ipAdress.js';

function UpdateTitulairesList({ members, setMatch, userInfos }) {

    const [membersList, setMembersList] = useState([]);
    const [check, setCheck] = useState([])
    const [tmp, setTmp] = useState([])
    const [listP, setListP] = useState([])
    const [titulairesList, setTitulairesList] = useState([])


    const getMembers = async () => {
        const allMembersRaw = await fetch(`${ipAdress}/getTeamMembers/${userInfos.team}`)
        let allMembers = await allMembersRaw.json()
        setTmp(allMembers.membresTeam)
        
    }

    // RECUPERATION DES MEMBRES A L'OUVERTURE
    useEffect(() => {
        setTitulairesList(members)
    }, [tmp])

    useEffect(() => {  
            getMembers()
    }, [])

    useEffect(() => {
        setCheck( tmp.map((e, i) => {
            let infos = {}
            if (titulairesList.indexOf(e.id) != -1) {
                infos = {
                    isChecked: true,
                    id: e.id
                }
            } else {
                infos = {
                    isChecked: false,
                    id: e.id
                }
            }
            return infos
        }
        ));
        setMembersList(tmp)
        
    }, [titulairesList])

    useEffect(() => {
        let tabTmp = [];
        check.map((e, i) => {
            if (e.isChecked == true) {
                tabTmp.push(e.id)
            }
            setListP(tabTmp)
        })
    }, [check])


    useEffect(() => {
        setMatch(listP)
    }, [listP])


    var listDesJoueurs = membersList.map((e, i) => {
if(!e.admin){
    return (
        <View style={{ display: "flex", flexDirection: 'row', justifyContent: 'space-between' }}>
            <Avatar rounded containerStyle={{ alignSelf: 'center' }} source={{ uri: e.picture_Url }} />
            <CheckBox checked={check[i].isChecked} containerStyle={{ backgroundColor: '#ffffff', borderColor: 'white' }} title={`${e.firstname} ${e.name}`} iconRight checkedIcon='circle' checkedColor='#FE7235' uncheckedIcon='circle-o' uncheckedColor='#FE7235'
                onIconPress={() => { setCheck(check.map((element, j) => { if (i == j) { element.isChecked = !element.isChecked } return element })) }}
            />
        </View>
    )
}
    })
    return (
        <View style={{ height: 200 }}>
            <Text style={{ textAlign: 'center', textAlignVertical: 'center', marginBottom: 10 }}>Ajouter des joueurs titulaires</Text>
            <ScrollView >
                {listDesJoueurs}
                <Divider />
            </ScrollView>
        </View>
    )
};

function mapStateToProps(state) {
    return { userInfos: state.userInfos, members: state.membersToUpdate }
}

function mapDispatchToProps(dispatch) {
    return {
        setMatch: function (membersMatch) {
            dispatch({ type: 'majMembers', membersMatch })
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UpdateTitulairesList);

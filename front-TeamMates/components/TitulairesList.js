import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { Text, Divider, CheckBox, Avatar } from 'react-native-elements'
import { connect } from 'react-redux';
import { ipAdress } from '../ipAdress.js';

function titulairesList({ userInfos, setMatch}) {

    const [membersList, setMembersList] = useState([]);
    const [check, setCheck] = useState([])
    const [tmp, setTmp] = useState([])

    const [listP, setListP] = useState([])
    
    useEffect(() => {
        let tabTmp = [];
        check.map((e,i) => {
        if(e.isChecked == true){
            tabTmp.push(e.id)
        }
setListP(tabTmp)
        
    })
    }, [check] )

    useEffect(() => {
setMatch(listP)
    }, [listP])


    const getMembers = async () => {
        const allMembersRaw = await fetch(`${ipAdress}/getTeamMembers/${userInfos.team}`)
        let allMembers = await allMembersRaw.json()
        setCheck(allMembers.membresTeam.map((e,i) => {
            let infos = {
                isChecked:false,
                id:e.id}
            return infos}
            ));
            setTmp(allMembers.membresTeam)    
    }

    // RECUPERATION DES MEMBRES A L'OUVERTURE
    useEffect(() => {
        getMembers()
        setMatch([])
    }, [])

    useEffect(() => {
    setMembersList(tmp)
    }, [tmp])

    var listDesJoueurs = membersList.map((e, i) => {      
        if(!e.admin){
        return (
            <View style={{ display: "flex", flexDirection: 'row', justifyContent: 'space-between' }}>
                <Avatar rounded containerStyle={{ alignSelf: 'center' }} source={{ uri: e.picture_Url }} />
                <CheckBox checked={check[i].isChecked} containerStyle={{ backgroundColor: '#ffffff', borderColor: 'white' }} title={`${e.firstname} ${e.name}`} iconRight checkedIcon='circle' checkedColor='#FE7235' uncheckedIcon='circle-o' uncheckedColor='#FE7235' 
                onIconPress={() => 
                    {setCheck(check.map((element,j) => {if(i==j){ element.isChecked = !element.isChecked } return element}))}} 
                    />
            </View>
        )}
    })
    return (
        <View style={{ height: 250}}>
            <Text style={{ textAlign: 'center', textAlignVertical: 'center', marginBottom: 10 }}>Ajouter des joueurs titulaires</Text>
            <ScrollView >
                {listDesJoueurs}
                <Divider />
            </ScrollView>
        </View>
    )
};

function mapStateToProps(state) {
    return { userInfos: state.userInfos }
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
)(titulairesList);

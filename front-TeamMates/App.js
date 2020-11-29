// CREATION DE LA NAVIGATION 
import React , { useState } from 'react';
import HomeScreen from './screens/HomeScreen';
import AccessTeamForPlayerScreen from './screens/AccessTeamForPlayerScreen'
import CodeAccessCoachForPlayers from './screens/CodeAccessCoachForPlayers'
import TeamInfoCoach from './screens/TeamInfoCoach'
import TactiquesScreen from './screens/TactiquesScreen'
import SignInScreen from './screens/SignInScreen';
import SignUpHomeScreen from './screens/SignUpHomeScreen';
import SignUpPlayerScreen from './screens/SignUpPlayerScreen';
import SignUpCoachScreen from './screens/SignUpCoachScreen';
import DashboardScreen from './screens/DashboardScreen';
import ProfilScreen from './screens/ProfilScreen';
import MembersScreen from './screens/MembersScreen';
import MenuComponent from './components/Menu';
import MatchScreen from './screens/MatchScreen';
import TrainingScreen from './screens/TrainingScreen';
import ChatScreen from './screens/ChatScreen';
import { Ionicons } from '@expo/vector-icons';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator} from 'react-navigation-drawer';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import userInfos from './reducers/userInfos';
import teamInfos from './reducers/teamInfos';
import membersMatch from './reducers/membersMatch';
import membersToUpdate from './reducers/membersToUpdate';
import * as Font from 'expo-font';
import {AppLoading} from 'expo';
console.disableYellowBox = true;


const getFonts = () => Font.loadAsync({
  'Roboto-Black': require('./assets/fonts/Roboto-Black.ttf'),
  'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
  'Roboto-Bold': require('./assets/fonts/Roboto-Bold.ttf'),
})

const store = createStore(combineReducers({userInfos, teamInfos, membersMatch,membersToUpdate}))

const DrawerNavigator = createDrawerNavigator({
  DashboardScreen: {
    screen: DashboardScreen,
    navigationOptions: {
      drawerIcon: (<Ionicons name="md-home" size={20} color="#ED6F33"  />),
      title: 'Dashboard'
    }
  },
  ProfilScreen: {
    screen: ProfilScreen,
    navigationOptions: {
      drawerIcon: (<Ionicons name="md-person" size={20} color="#ED6F33"  />),
      title: 'Profil'
    },
  },
  ChatScreen: {
    screen: ChatScreen,
    navigationOptions: {
      drawerIcon: (<Ionicons  name="ios-mail" size={20} color="#ED6F33"  />),
      title: 'Messages'
    },
  },
  MembersScreen: {
    screen: MembersScreen,
    navigationOptions: {
      drawerIcon: (<Ionicons name="ios-list-box" size={20} color="#ED6F33"  />),
      title: 'Membres'
    },
  },
  TactiquesScreen: {
    screen: TactiquesScreen,
    navigationOptions: {
      drawerIcon: (<Ionicons name="ios-clipboard" size={20} color="#ED6F33"  />),
      title: 'Fiches tactiques'
    },
  }},
  {
    drawerPosition: 'right',
    contentComponent: props => <MenuComponent props={props}/>,
    drawerOpenRoute: 'DrawerOpen',
    drawerCloseRoute: 'DrawerClose',
    drawerToggleRoute: 'DrawerToggle',
    contentOptions: {
      activeTintColor: '#FE7235',
      activeBackgroundColor: '#ffffff',
    }
  }
)


StackNavigator = createStackNavigator({
  HomeScreen: HomeScreen,
  SignInScreen: SignInScreen,
  SignUpHomeScreen: SignUpHomeScreen,
  SignUpPlayerScreen: SignUpPlayerScreen,
  SignUpCoachScreen: SignUpCoachScreen,
  MatchScreen: MatchScreen,
  TrainingScreen: TrainingScreen,
  // ChatScreen:ChatScreen,
  CodeAccessCoachForPlayers: CodeAccessCoachForPlayers,
  AccessTeamForPlayerScreen: AccessTeamForPlayerScreen,
  TeamInfoCoach: TeamInfoCoach,
  DrawerNavigator : DrawerNavigator
 }, 
  {headerMode: 'none'}
  );   

const Navigation = createAppContainer(StackNavigator);

export default function App() {
  const [ fontsLoaded, setFontsLoaded ] = useState(false);
 if(fontsLoaded){
   return (
<Provider store={store}>
 <Navigation />
  </Provider> 
   )
 } else {
     return (
       <AppLoading
         startAsync={getFonts}
         onFinish={()=> setFontsLoaded(true)}
       />
     )
   } 
 }


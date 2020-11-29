import React, { useState } from 'react';
import { ImageBackground, StyleSheet, View, Text, Image } from 'react-native';
import { Button} from 'react-native-elements'
import AppIntroSlider from 'react-native-app-intro-slider';
function HomeScreen({ navigation }) {

    // Etat pour skipper la présentation de l'app si on appuit sur "Skip" ou quand on a finit de lire.
    const [showRealApp, setShowRealApp] = useState(false);

    const onDone = () => {
        setShowRealApp(true);
    };
    const onSkip = () => {
        setShowRealApp(true);
    };

    // Render des trois sliders
    const RenderItem = ({ item }) => {
        return (
            <ImageBackground source={item.image} style={styles.container}>
                <View style={styles.overlay} />
                <Image
                    style={styles.logo}
                    source={require('../assets/logo_TM_V2_white.png')}
                />
                <Text style={styles.introTitleStyle}>
                    {item.title}
                </Text>
                <Text style={styles.introTextStyle}>
                    {item.text}
                </Text>

            </ImageBackground>
        );
    };


    const slides = [
        {
            key: 's1',
            text: 'Un entraînement annulé, un match reporté ? Soyez prévenu des dernières actualités de votre équipe en temps réel.',
            title: 'NE MANQUEZ PLUS AUCUNE INFO',
            image: require('../assets/basketball.jpg'),
            backgroundColor: '#20d2bb',
        },
        {
            key: 's2',
            title: 'SUIVEZ VOS STATISTIQUES',
            text: 'Chaque jour est un nouveau défi. Suivez-vos statistiques pour voir votre progression au sein de votre équipe et monter en performance',
            image: require('../assets/tennis.jpg'),
            backgroundColor: '#febe29',
        },
        {
            key: 's3',
            title: 'PARTAGEZ L’ESPRIT D’ÉQUIPE',
            text: 'Réussir est l’affaire de toute une équipe. Partagez et communiquez avec les membres de votre Team.',
            image: require('../assets/football.jpg'),
            backgroundColor: '#22bcb5',
        }];


    return (
        // Condition ternaire pour le return
        <>
            {showRealApp ? (
                    
                <ImageBackground source={require('../assets/ezgif.com-gif-maker.gif')} style={styles.backgroundVideo}>
                    <View style={styles.overlay} />
                    <Image
                        style={styles.logo}
                        source={require('../assets/logo_TM_V2_white.png')}
                    />
                    <Button onPress={() => { navigation.navigate('SignUpHomeScreen') }} title="Inscription" buttonStyle={{ backgroundColor: "#000", width: 180, height: 52,opacity:0.8 }} containerStyle={{ position: "absolute", top: 500, borderRadius:20 }} />
                    <Button onPress={() => { navigation.navigate('SignInScreen') }} title="Se connecter" buttonStyle={{ backgroundColor: "#000", width: 180, height: 52,opacity:0.8 }} containerStyle={{ position: "absolute", top: 600, borderRadius:20 }} />
      
                    <Image
                        style={styles.logo}
                        source={require('../assets/logo_TM_V2_white.png')}
                    />


                </ImageBackground>

            ) : (
                    <AppIntroSlider
                        data={slides}
                        renderItem={RenderItem}
                        onDone={onDone}
                        showSkipButton={true}
                        onSkip={onSkip}
                    />
                )}
        </>
    )
}
const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        resizeMode: "cover",
    },
    logo: {
        width: 66,
        height: 58,
        position: 'absolute',
        top: 100,
        width: 200,
        height: 200,
    },
    header: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    introTextStyle: {
        fontFamily:'Roboto-Regular',
        fontSize: 16,
        color: 'white',
        textAlign: 'center',
        paddingVertical: 30,
        paddingLeft: 20,
        paddingRight: 20,
    },
    introTitleStyle: {
        fontFamily:'Roboto-Bold',
        fontSize: 20,
        color: 'white',
        textAlign: 'center',
        marginBottom: 16,
        fontWeight: 'bold',
        paddingTop: 50,
    },backgroundVideo: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        resizeMode: "cover",
        opacity:0.95
        }
});



export default HomeScreen

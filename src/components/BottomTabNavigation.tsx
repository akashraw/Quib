import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import IonIcon from 'react-native-vector-icons/Ionicons';
import ChooseMovies from '../screens/visitScreens/ChooseMovies';
import ProfileScreen from '../screens/profileScreens/ProfileScreen';
import SetttingScreen from '../screens/settingScreen/SetttingScreen';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import OnLandingButton from './OnLandingButton';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Style } from '../constants/Styles';
// import Icon from 'react-native-vector-icons/FontAwesome';
import { vw } from 'rxn-units';
import NotificationScreen from '../screens/notificationScreen/NotificationScreen';

const Tab = createBottomTabNavigator();

const WWQ = (props: any) => {
    const navigation = useNavigation();
    return (
        <View >
            <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.navigate('Home' as never)}>
                <IonIcon name='arrow-back' size={20} color={Style.defaultRed} />
                <Text style={{ fontSize: 20, fontWeight: 'bold', paddingLeft: vw(2), color: Style.defaultRed }}>{props.title}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default function BottomTabNavigation() {
    return (

        <Tab.Navigator
            initialRouteName='Choose'
            screenOptions={{
                tabBarActiveTintColor: Style.defaultRed,
                tabBarStyle:{paddingHorizontal:vw(5), backgroundColor:Style.quibHeader},
                headerStyle: { backgroundColor: Style.quibHeader },
            
            }}
            
        >
            <Tab.Screen
                name='Choose'
                component={ChooseMovies}
                options={{
                    tabBarLabel: 'Movies',
                    tabBarShowLabel:false,
                    headerTitle: () => <WWQ title={`What we're quibbing`} />,
                    headerRight: () => <OnLandingButton text="Log In" onPress="Test" viewStyle={styles.button} textStyle={styles.buttonTxt} />,
                    tabBarIcon: ({focused}) =>{ 
                        if(focused) return < IonIcon name='home' color={Style.defaultRed} size={24} />
                        else return < IonIcon name='home-outline' size={24} />
                    }
                }}

            />
           
            <Tab.Screen
                name='Notification'
                component={NotificationScreen}
                options={{
                    tabBarLabel: 'Notification',
                    tabBarShowLabel:false,
                    tabBarIcon: ({focused}) => {
                        if(focused) return <IonIcon name='notifications' color={Style.defaultRed} size={24} />
                        else return  <IonIcon name='notifications-outline' size={24} />
                    }
                }}
            />
             <Tab.Screen
                name='Profile'
                component={ProfileScreen}
                options={{
                    tabBarLabel: 'Profile',
                    tabBarShowLabel:false,
                    tabBarIcon: ({focused}) => {
                        if(focused) return < IonIcon name='person' color={Style.defaultRed} size={24} />
                        else return < IonIcon name='person-outline' size={24} />
                    }
                }}
            />
            <Tab.Screen
                name='Setting'
                component={SetttingScreen}
                options={{
                    tabBarLabel: 'Setting',
                    tabBarShowLabel:false,
                    tabBarIcon: ({focused}) => {
                        if(focused) return <IonIcon name='settings' color={Style.defaultRed} size={24} />
                        else return  <IonIcon name='settings-outline' size={24} />
                    }
                }}
            />
            {/* <Tab.Screen

            /> */}
        </Tab.Navigator>
    )
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Style.defaultRed,
        width: vw(18),
        height: vw(8),
        borderRadius: vw(2),
        alignSelf: 'center',
        marginRight: vw(2)
    },
    buttonTxt: {
        textAlign: 'center',
        fontSize: 14,
        color: '#fff',
        fontWeight: 'bold'
    },
})
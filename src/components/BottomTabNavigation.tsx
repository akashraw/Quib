import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import IonIcon from 'react-native-vector-icons/Ionicons';
import ChooseMovies from '../screens/chooseMovieScreen/ChooseMovies';
import ProfileScreen from '../screens/profileScreens/ProfileScreen';
import SetttingScreen from '../screens/settingScreen/SetttingScreen';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import OnLandingButton from './QuibButton';
import { Alert, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Style } from '../constants/Styles';
// import Icon from 'react-native-vector-icons/FontAwesome';
import { vh, vw } from 'rxn-units';
import QuibButton from './QuibButton';
import { AuthContext } from '../Auth';
import Net from '../Net';


const Tab = createBottomTabNavigator();

const Heading = (props: any) => {
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} >
            <Text style={{ fontSize: 22, fontWeight: '500', color: Style.defaultRed }}>{props.title}</Text>
        </View>
    )
}
const BackIcon = () => {
    const navigation = useNavigation();
    return (
        <View >
            <TouchableOpacity style={{ flexDirection: 'row', paddingLeft: vw(4), justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.goBack()}>
                <IonIcon name='arrow-back' size={26} color={Style.defaultRed} />
            </TouchableOpacity>
        </View>
    )
}


export default function BottomTabNavigation(navigation: any) {
    const Auth = React.useContext(AuthContext)
    const navi = useNavigation();
    return (
        <>
            <Tab.Navigator
                initialRouteName='Choose'
                screenOptions={{
                    tabBarActiveTintColor: Style.defaultRed,
                    tabBarStyle: { paddingHorizontal: vw(5), backgroundColor: Style.quibHeader },
                    headerStyle: { backgroundColor: Style.quibHeader },

                }}

            >
                <Tab.Screen
                    name='Choose'
                    component={ChooseMovies}
                    options={{
                        tabBarLabel: 'Movies',
                        tabBarShowLabel: false,
                        headerTitleAlign: 'center',
                        // headerTitleStyle:{marginLeft:vw(2)},
                        headerTitle: () => <Heading title={`What we're quibbing`} />,
                        headerLeft: () => Auth.isGuest == true ? <BackIcon /> : null,
                        headerRight: () => Auth.isGuest == true ? <QuibButton text="Log In" onPressed={() => { navi.navigate('Login' as never) }} viewStyle={styles.button} textStyle={styles.buttonTxt} /> : null,
                        tabBarIcon: ({ focused }) => {
                            if (focused) return < IonIcon name='home' color={Style.defaultRed} size={24} />
                            else return < IonIcon name='home-outline' size={24} color={Style.defaultRed} />
                        }
                    }}

                />

                {/* <Tab.Screen
                name='Notification'
                component={NotificationScreen}
                options={{
                    tabBarLabel: 'Notifications',
                    tabBarShowLabel: false,
                    headerTitleAlign:'center',
                    headerTitle: () => <Heading title={`Notifications`} />,
                    headerLeft: () => <BackIcon />,
                    // headerRight: () => (<TouchableOpacity onPress={undefined}><IonIcon style={{paddingRight:vw(2)}} name='create-outline' size={20} color={Style.defaultRed}/></TouchableOpacity>),
                    tabBarIcon: ({ focused }) => {
                        if (focused) return <IonIcon name='notifications' color={Style.defaultRed} size={24} />
                        else return <IonIcon name='notifications-outline' size={24} color={Style.defaultRed} />
                    }
                }}
            /> */}
                <Tab.Screen
                    name='Profile'
                    listeners={({ navigation }) => ({
                        tabPress: (e) => {
                            if (Auth.isGuest == true) {
                                // Prevent default action
                                e.preventDefault();
                                Auth.dispatch({
                                    type: 'MODAL',
                                    name: null,
                                    isGuest: true,
                                    modal: true,
                                })
                            }
                        },
                    })}
                    component={ProfileScreen}
                    options={{
                        // tabBarButton: props => (Auth.isGuest == false ? ProfileScreen : PleaseLogin),
                        tabBarLabel: 'Profile',
                        tabBarShowLabel: false,
                        headerTitleAlign: 'center',
                        headerTitle: () => <Heading title={`Profile`} />,
                        headerLeft: () => <BackIcon />,
                        headerRight: () => <TouchableOpacity onPress={() => navi.navigate('Edit' as never)}>
                            <IonIcon style={{ paddingRight: vw(6) }} name='create-outline' size={24} color={Style.defaultRed} />
                        </TouchableOpacity>,
                        tabBarIcon: ({ focused }) => {
                            if (focused) return < IonIcon name='person' color={Style.defaultRed} size={24} />
                            else return < IonIcon name='person-outline' size={24} color={Style.defaultRed} />
                        }
                    }}
                />
                <Tab.Screen
                    name='Setting'
                    component={SetttingScreen}
                    options={{
                        tabBarLabel: 'Setting',
                        tabBarShowLabel: false,
                        headerTitleAlign: 'center',
                        headerTitle: () => <Heading title={`Settings`} />,
                        headerLeft: () => <BackIcon />,
                        // headerRight: () => <QuibButton text="Log In" onPress="Test" viewStyle={styles.button} textStyle={styles.buttonTxt} />,
                        tabBarIcon: ({ focused }) => {
                            if (focused) return <IonIcon name='settings' color={Style.defaultRed} size={24} />
                            else return <IonIcon name='settings-outline' size={24} color={Style.defaultRed} />
                        }
                    }}
                />
                {/* <Tab.Screen

            /> */}
            </Tab.Navigator>
            {/* <Net /> */}
        </>
    )
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Style.defaultRed,
        width: vw(15),
        height: vw(7),
        borderRadius: vw(1),
        alignSelf: 'center',
        marginRight: vw(3)
    },
    buttonTxt: {
        textAlign: 'center',
        fontSize: 14,
        color: '#fff',
        fontWeight: 'bold'
    },
})
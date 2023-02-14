import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomTabNavigation from '../components/BottomTabNavigation';
import QuibPlayer from '../components/quibPlayer/QuibPlayer';
import {Style} from '../constants/Styles';
import LoginScreen from '../screens/onBoardingScreens/LoginScreen';
import OnLanding from '../screens/onBoardingScreens/OnLanding';
import RegisterScreen from '../screens/onBoardingScreens/RegisterScreen';
import OtherProfileScreen from '../screens/otherProfileScreens/OtherProfileScreens';
import ProfileEditScreen from '../screens/profileScreens/ProfileEditScreen';
import ProfileScreen from '../screens/profileScreens/ProfileScreen';
import ProfileStream from '../screens/profileScreens/ProfileStream';
import {
  BackIcon,
  EditIcon,
  Heading,
  Logo,
} from '../components/HeaderComponents';
import {vw} from 'rxn-units';

const Stack = createNativeStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: Style.quibHeader},
        statusBarColor: Style.quibHeader,
        navigationBarHidden: true,
      }}
      initialRouteName="Bottom">
      {/* <Stack.Screen name='Choose' component={ChooseMovies} options={{
            headerTitle: () => <WWQ title={`What we're quibbing`} />,
            headerBackVisible: false,
            headerRight: () => <OnLandingButton text="Log In" onPress="Test" viewStyle={styles.button} textStyle={styles.buttonTxt} />,
          }} /> */}
      <Stack.Screen
        name="Bottom"
        component={BottomTabNavigation}
        options={{
          gestureEnabled: false,
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Qplayer"
        component={QuibPlayer}
        options={{
          gestureEnabled: false,
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="OtherProfile"
        component={OtherProfileScreen}
        options={{
          headerTitleAlign: 'center',
          headerTitle: () => <Heading title={`Profile`} />,
          headerLeft: () => <BackIcon />,
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerTitleAlign: 'center',
          headerTitle: () => <Heading title={`Profile`} />,
          headerLeft: () => <BackIcon />,
          headerRight: () => <EditIcon />,
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="Edit"
        component={ProfileEditScreen}
        options={{
          headerTitleAlign: 'center',
          headerTitle: () => <Heading title={'Edit Profile'} />,
          headerLeft: () => <BackIcon />,
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="Stream"
        component={ProfileStream}
        options={{
          headerTitleAlign: 'center',
          headerTitle: () => <Heading title={'Stream'} />,
          headerLeft: () => <BackIcon />,
          headerBackVisible: false,
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: vw(3),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Style.defaultRed,
    width: vw(25),
    height: vw(8),
    borderRadius: vw(2),
    marginBottom: 10,
  },
  buttonTxt: {
    textAlign: 'center',
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

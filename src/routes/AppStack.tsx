import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigation from '../components/BottomTabNavigation';
import QuibPlayer from '../components/quibPlayer/QuibPlayer';
import { Style } from '../constants/Styles';
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
import { vw } from 'rxn-units';
import SeeMoreRecent from '../screens/chooseMovieScreen/SeeMoreRecent';
import SeeMoreActive from '../screens/chooseMovieScreen/SeeMoreActive';
import RNBootSplash from "react-native-bootsplash";

const Stack = createNativeStackNavigator();

export default function AppStack() {
  React.useEffect(() => {
    RNBootSplash.hide({ fade: true, duration: 500 });
  }, []);

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Style.quibHeader },
        statusBarColor: Style.quibHeader,
        // navigationBarHidden: true,
        navigationBarColor:'transparent'
      }}
      initialRouteName="Bottom">
      <Stack.Screen
        name="Bottom"
        component={BottomTabNavigation}
        options={{
          gestureEnabled: false,
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='SeeRecent'
        component={SeeMoreRecent}
        options={{
          headerTitleAlign: 'center',
          // headerTitleStyle:{marginLeft:vw(2)},
          headerTitle: () => <Heading title={`Recent Movies`} />,
          headerLeft: () => <BackIcon />,
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name='SeeMostActive'
        component={SeeMoreActive}
        options={{
          headerTitleAlign: 'center',
          // headerTitleStyle:{marginLeft:vw(2)},
          headerTitle: () => <Heading title={`Most Active Movies`} />,
          headerLeft: () => <BackIcon />,
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="Qplayer"
        component={QuibPlayer}
        options={{
          gestureEnabled: false,
          headerShown: false,
          statusBarTranslucent: true,
          statusBarColor: 'transparent'
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
          headerTitle: () => <Heading title={'Quib Stack'} />,
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

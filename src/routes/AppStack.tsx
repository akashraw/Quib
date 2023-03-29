import { GestureResponderEvent, StyleSheet, Text, View } from 'react-native';
import React, { useContext } from 'react';
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
import QuibButton from '../components/QuibButton';
import { AuthContext } from '../Auth';
import { useNavigation } from '@react-navigation/native';
import Net from '../Net';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import NewQuibPlayer from '../components/quibPlayer/NewQuibPlayer';

const Stack = createNativeStackNavigator();
function ModalScreen({ navigation }: any) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: vw(7.7) }}>This is a modal!</Text>
      <QuibButton text={''} onPressed={() => null} textStyle={undefined} />
    </View>
  );
}


export default function AppStack() {
  const Auth = useContext(AuthContext);
  // const navi = useNavigation();
  React.useEffect(() => {
    RNBootSplash.hide({ fade: true, duration: 500 });
  }, []);

  return (
    <SafeAreaProvider>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: Style.quibHeader },
          statusBarColor: Style.quibHeader,
          // navigationBarHidden: true,
          navigationBarColor: 'transparent',
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
            presentation: 'card',
            headerTitleAlign: 'center',
            // headerTitleStyle:{marginLeft:vw(2)},
            headerTitle: () => <Heading device={Auth.DeviceType} title={`Recent Movies`} />,
            headerLeft: () => <BackIcon device={Auth.DeviceType} />,
            headerBackVisible: false,
          }}
        />
        <Stack.Screen
          name='SeeMostActive'
          component={SeeMoreActive}
          options={{
            presentation: 'card',
            headerTitleAlign: 'center',
            // headerTitleStyle:{marginLeft:vw(2)},
            headerTitle: () => <Heading device={Auth.DeviceType} title={`Most Active Movies`} />,
            headerLeft: () => <BackIcon device={Auth.DeviceType}/>,
            headerBackVisible: false,
          }}
        />
        <Stack.Screen
          name="Qplayer"
          component={NewQuibPlayer}
          options={{
            presentation: 'card',
            gestureEnabled: false,
            headerShown: false,
            statusBarTranslucent: true,
            statusBarColor: 'transparent',
            navigationBarHidden:true
          }}
        />
        <Stack.Screen
          name="OtherProfile"
          component={OtherProfileScreen}
          options={{
            headerTitleAlign: 'center',
            headerTitle: () => <Heading device={Auth.DeviceType} title={`Profile`} />,
            headerLeft: () => <BackIcon device={Auth.DeviceType}/>,
            headerBackVisible: false,
          }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            presentation: 'card',
            headerTitleAlign: 'center',
            headerTitle: () => <Heading title={`Profile`} />,
            headerLeft: () => <BackIcon device={Auth.DeviceType} />,
            headerRight: () => <EditIcon device={Auth.DeviceType} />,
            headerBackVisible: false,
          }}
        />
        <Stack.Screen
          name="Edit"
          component={ProfileEditScreen}
          options={{
            presentation: 'card',
            headerTitleAlign: 'center',
            headerTitle: () => <Heading device={Auth.DeviceType} title={'Edit Profile'} />,
            headerLeft: () => <BackIcon device={Auth.DeviceType} />,
            headerBackVisible: false,
          }}
        />
        <Stack.Screen
          name="Stream"
          component={ProfileStream}
          options={{
            headerTitleAlign: 'center',
            headerTitle: () => <Heading device={Auth.DeviceType} title={'Quib Stack'} />,
            headerLeft: () => <BackIcon device={Auth.DeviceType} />,
            headerBackVisible: false,
          }}
        />
      </Stack.Navigator>
      <Net />
    </SafeAreaProvider>
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
    marginBottom: vw(2.5),
  },
  buttonTxt: {
    textAlign: 'center',
    fontSize: vw(3.6),
    color: '#fff',
    fontWeight: 'bold',
  },
});

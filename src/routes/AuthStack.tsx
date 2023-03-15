import { StyleSheet } from 'react-native';
import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigation from '../components/BottomTabNavigation';
import QuibPlayer from '../components/quibPlayer/QuibPlayer';
import { Style } from '../constants/Styles';
import LoginScreen from '../screens/onBoardingScreens/LoginScreen';
import OnLanding from '../screens/onBoardingScreens/OnLanding';
import RegisterScreen from '../screens/onBoardingScreens/RegisterScreen';
import OtherProfileScreen from '../screens/otherProfileScreens/OtherProfileScreens';
import ProfileStream from '../screens/profileScreens/ProfileStream';
import {
  BackIcon,
  Heading,
  Logo,
} from '../components/HeaderComponents';
import { vw } from 'rxn-units';
import GuestProfileScreen from '../screens/profileScreens/GuestProfileScreen';
import ForgetPassword from '../screens/onBoardingScreens/ForgetPassword';
import RNBootSplash from "react-native-bootsplash";
import ResetPassword from '../screens/onBoardingScreens/ResetPassword';
import Net from '../Net';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { AuthContext } from '../Auth';
const Stack = createNativeStackNavigator();

export default function AuthStack() {
  React.useEffect(() => {
    RNBootSplash.hide({ fade: true, duration: 500 });
  }, []);
  const Auth = useContext(AuthContext);
  return (
    <SafeAreaProvider>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: Style.quibHeader },
          statusBarColor: Style.quibHeader,
          // navigationBarHidden: true,
          navigationBarColor:'transparent'
        }}
        initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={OnLanding}
          options={{
            headerShown: false,
            statusBarColor: Style.quibBackColor,
            header: () => <Logo />,
            navigationBarHidden: true,
            
          }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{
            header: () => <Logo />,
            headerBackVisible: false,
            headerShown: false,
            headerLeft: () => <BackIcon />,
            statusBarColor: Style.quibBackColor,
            navigationBarHidden: true,
            // headerRight: () => <OnLandingButton text="Log In" onPress="Login" viewStyle={null} textStyle={null} />,
          }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerShown: false,
            navigationBarHidden: true,
            statusBarColor: Style.quibBackColor,
          }}
        />
        <Stack.Screen
          name="Forget"
          component={ForgetPassword}
          options={{
            headerShown: false,
            navigationBarHidden: true,
            statusBarColor: Style.quibBackColor,
          }}
        />
        <Stack.Screen
          name="Reset"
          component={ResetPassword}
          options={{
            headerShown: false,
            navigationBarHidden: true,
            statusBarColor: Style.quibBackColor,
          }}
        />
        <Stack.Screen
          name="Guest"
          component={GuestProfileScreen}
          options={{
            headerShown: false,
            statusBarColor: Style.quibBackColor,
          }}
        />
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
    marginBottom: 10,
  },
  buttonTxt: {
    textAlign: 'center',
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

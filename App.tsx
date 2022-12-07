import { Image, StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native'
import React from 'react'
import OnLanding from './src/screens/onBoardingScreens/OnLanding'
import RegisterScreen from './src/screens/onBoardingScreens/RegisterScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import OnLandingButton from './src/components/OnLandingButton';
import LoginScreen from './src/screens/onBoardingScreens/LoginScreen';
import ChooseMovies from './src/screens/visitScreens/ChooseMovies';
import { Style } from './src/constants/Styles';
import  Icon from 'react-native-vector-icons/FontAwesome';
import QuibPlayer from './src/screens/quibPlayer/QuibPlayer';

export type RootStackParamList = {
  Home: undefined;
  Register: undefined;
  Login: undefined;

}

const Stack = createNativeStackNavigator();
interface props {
  navigation: any;
}
const Logo = () => {
  const navigation = useNavigation();
  return (
    <View >
      <TouchableOpacity onPress={() => navigation.navigate('Home' as never)}>
        <Image
          source={require('./src/assets/logo.png')}
        />
      </TouchableOpacity>

    </View>

  )
}
const WWQ = () => {
  const navigation = useNavigation();
  return (
    <View >
      <TouchableOpacity  style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}} onPress={() => navigation.navigate('Home' as never)}>
        <Icon name='angle-left' size={50} color={Style.defaultRed} />
        <Text style={{fontSize:20, fontWeight:'bold', paddingLeft:6, color:Style.defaultRed}}>What we're quibbing</Text>
      </TouchableOpacity>
    </View>
  )
}


export default function App({ navigation }: any) {

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: Style.quibHeader} }} initialRouteName="Home">
        <Stack.Screen name='Home' component={OnLanding} options={{ headerTitle: () => <Logo /> }} />
        <Stack.Screen name='Register' component={RegisterScreen} options={{
          headerTitle: () => <Logo />,
          headerBackVisible: false,
          headerRight: () => <OnLandingButton text="Log In" onPress="Login" />,
        }} />
        <Stack.Screen name='Login' component={LoginScreen} options={{
          headerTitle: () => <Logo />,
          headerBackVisible: false,
          headerRight: () => <OnLandingButton text="Join" onPress="Register" />,
        }} />
        <Stack.Screen name='Choose' component={ChooseMovies} options={{
          headerTitle: () => <WWQ />,
          headerBackVisible: false,
          headerRight: () => <OnLandingButton text="Log In" onPress="Login" />,
        }} />
        <Stack.Screen name='Qplayer' component={QuibPlayer} options={{
          headerShown:false
        }} />
      </Stack.Navigator>
    </NavigationContainer>

  )
}


const styles = StyleSheet.create({})
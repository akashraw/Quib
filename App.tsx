import { Image, StyleSheet, Touchable, TouchableOpacity, View } from 'react-native'
import React from 'react'
import OnLanding from './src/screens/onBoardingScreens/OnLanding'
import RegisterScreen from './src/screens/onBoardingScreens/RegisterScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import OnLandingButton from './src/components/OnLandingButton';
import LoginScreen from './src/screens/onBoardingScreens/LoginScreen';
import ChooseMovies from './src/screens/visitScreen/ChooseMovies';

export type RootStackParamList = {
  Home: undefined;
  Register: undefined;
  Login: undefined;

}

const Stack = createNativeStackNavigator();
interface props {
  navigation: any;
}
const Logo: React.FC = () => {
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

export default function App({navigation} : any) {
  
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#91b9b8' } }} initialRouteName="Home">
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
          headerTitle: () => <Logo />,
          headerBackVisible: false,
          headerRight: () => <OnLandingButton text="Log In" onPress="Login" />,
        }} />

      </Stack.Navigator>
    </NavigationContainer>

  )
}


const styles = StyleSheet.create({})
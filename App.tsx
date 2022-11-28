import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import OnLanding from './src/screens/onBoardingScreens/OnLanding'
import RegisterScreen from './src/screens/onBoardingScreens/RegisterScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import OnLandingButton from './src/components/OnLandingButton';
import LoginScreen from './src/screens/onBoardingScreens/LoginScreen';


const Stack = createNativeStackNavigator();

const Logo = () => {
  return (
    <View style={{ flex: 1, flexDirection: 'row', justifyContent: "space-between" }}>
      <Image
        // style={{ width: 50, height: 50 }}
        source={require('../Quibs/src/assets/logo.png')}
      />
    </View>

  )
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#91b9b8' } }} initialRouteName="Home">
        <Stack.Screen name='Home' component={OnLanding} options={{ headerTitle: () => <Logo /> }} />
        <Stack.Screen name='Register' component={RegisterScreen} options={{
          headerTitle: () => <Logo />,
          headerBackVisible: false,
          headerRight: () => <OnLandingButton text="Log In" onPress={null} />,
        }} />
        <Stack.Screen name='Login' component={LoginScreen} options={{
          headerTitle: () => <Logo />,
          headerBackVisible: false,
          headerRight: () => <OnLandingButton text="Join" onPress={null} />,
        }} />

      </Stack.Navigator>
    </NavigationContainer>

  )
}


const styles = StyleSheet.create({})
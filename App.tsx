import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AuthProvider from './src/Auth';
import Router from './src/Router';
import 'react-native-gesture-handler';
import 'react-native-reanimated';

export type RootStackParamList = {
  Home: undefined;
  Register: undefined;
  Login: undefined;

}

export default function App() {
  
  // const navigation = useNavigation();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
          <Router />
      </AuthProvider>
    </GestureHandlerRootView>

  )
}

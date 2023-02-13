import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppStack from './routes/AppStack';
import AuthStack from './routes/AuthStack';
import Auth, { AuthContext } from './Auth';
import RNBootSplash from "react-native-bootsplash";

export default function Router() {
    const auth = useContext(AuthContext);
    // console.log(auth)

    return (
        <NavigationContainer onReady={() => RNBootSplash.hide({ fade: true })}>
            {(auth.userName !== null) ? <AppStack /> : <AuthStack />}
        </NavigationContainer>
    );
};
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppStack from './routes/AppStack';
import AuthStack from './routes/AuthStack';
import Auth, { AuthContext } from './Auth';

export default function Router() {
    const auth = useContext(AuthContext);
    
    return (
        <NavigationContainer >
            {(auth.userName != null) ? <AppStack /> : <AuthStack />}
        </NavigationContainer>
    );
};
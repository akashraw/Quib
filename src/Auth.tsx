import React, { createContext, useContext, useReducer, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authReducer from './Reducer';

// import {AuthData, authService} from '../services/authService';
type AuthData = {
    userName: string;
    isLoading: boolean;
};
type AuthContextData = {
    userName: string;
    isLoading: boolean;
    handleLogin(): Promise<void>;
    getAuthState(): Promise<void>;
    handleLogout(): void;
};

const initialState = {
    userName: null,
    isLoading: true,
};


// CONFIG KEYS [Storage Keys]===================================
// export const TOKEN_KEY = 'token';
export const USER_KEY = 'user';
export const keys = [USER_KEY];

//Create the Auth Context with the data type specified
//and a empty object
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export default function AuthProvider({ children }: { children: React.ReactNode }) {

    // useREDUCER =================================================
    const [state, dispatch] = useReducer(authReducer, initialState);
    console.log(AuthContext)
    // Get Auth state
    const getAuthState = async () => {
        try {
            //GET TOKEN && USER
            // let token = await AsyncStorage.getItem(TOKEN_KEY);
            let user = await AsyncStorage.getItem(USER_KEY) || '{}';
            user = JSON.parse(user);

            if (user !== null) await handleLogin(user);
            else await handleLogout();

            return { user };
        } catch (error) {
            console.log(error)
        }
    };

    // Handle Login
    const handleLogin = async (data: any) => {
        try {
            //STORE DATA
            // token = [TOKEN_KEY, token]
            // let dataAsync = [[USER_KEY, JSON.stringify(user)], [TOKEN_KEY, token]];
            await AsyncStorage.setItem(USER_KEY, JSON.stringify(data));


            //DISPATCH TO REDUCER
            dispatch({
                type: 'LOGIN',
                // token: undefined,
                name: data
            });
        } catch (error) {
            // throw new Error(error);
            console.log(error)

        }
    };

    // Handle Logout
    const handleLogout = async () => {
        try {

            //REMOVE DATA
            await AsyncStorage.multiRemove(keys);

            //DISPATCH TO REDUCER
            dispatch({
                type: 'LOGOUT',
                // token: undefined,
                name: null
            });
        } catch (error) {
            // throw new Error(error);
            console.log(error)
        }
    };
    const value = useMemo(() => {
        return { ...state, getAuthState, handleLogin, handleLogout, dispatch };
    }, [state]);



    return (
        //This component will be used to encapsulate the whole App,
        //so all components will have access to the Context
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

//A simple hooks to facilitate the access to the AuthContext
// and permit components to subscribe to AuthContext updates
const useAuth = () => {
    useContext(AuthContext)
    // console.log(AuthContext)
    if (AuthContext === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return AuthContext;
};


export { AuthContext, useAuth };
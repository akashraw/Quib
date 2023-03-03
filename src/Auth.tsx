import React, { createContext, useContext, useReducer, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authReducer from './Reducer';
import { useNavigation } from '@react-navigation/native';
import NetInfo from "@react-native-community/netinfo";

// import {AuthData, authService} from '../services/authService';
type AuthData = {
    userName: string;
    isGuest: boolean;
};
type AuthContextData = {
    userName: string;
    isGuest: boolean;
    Modal: boolean;
    handleLogin: (p: object) => {};
    getAuthState: () => {};
    handleLogout: () => {};
    dispatch: (p: object) => {};
    net: boolean;
};

const initialState = {
    userName: null,
    isGuest: true,
    Modal: false,
};


// CONFIG KEYS [Storage Keys]===================================
// export const TOKEN_KEY = 'token';
export const USER_KEY = 'user';

//Create the Auth Context with the data type specified
//and a empty object
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export default function AuthProvider({ children }: { children: React.ReactNode }) {

    // useREDUCER =================================================
    const [state, dispatch] = useReducer(authReducer, initialState);

    //=======================useEffect FOR GETTING THE LAST USER STATE=========================\\
    React.useEffect(() => {
        // handleLogout();
        getAuthState();
    }, [])

    React.useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            // console.log("Connection type", state.type);
            // console.log("Is connected?", state.isConnected);
            console.log("Is connected?", state.isConnected);
            ConnectionInfo(state.isConnected);
        });

        // Unsubscribe
        return () => {
            unsubscribe();
        };
    }, [])

    //===========net info===========\\
    const ConnectionInfo = (isConnected: any) => {
        if (isConnected == false) {
            return dispatch({
                type: 'NETINFO',
                net: true
            })
        } else return dispatch({
            type: 'NETINFO',
            net: false
        })
    }
    // Get Auth state
    const getAuthState = async () => {
        try {
            //GET TOKEN && USER
            // let token = await AsyncStorage.getItem(TOKEN_KEY);
            // await AsyncStorage.clear()
            let user = await AsyncStorage.getItem(USER_KEY);
            user !== null ? user : null;
            if (user !== null) {
                dispatch({
                    type: 'LOGIN',
                    isGuest: false,
                    name: user,
                    modal: false
                })
                return true;
            } else {
                await handleLogout();
                return false
            }
        } catch (error) {
            console.log('this ' + error)
        }
    };

    // Handle Login
    const handleLogin = async (data: any) => {
        try {
            await AsyncStorage.setItem(USER_KEY, data);

            //DISPATCH TO REDUCER
            dispatch({
                type: 'LOGIN',
                isGuest: false,
                name: data,
                modal: false
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
            await AsyncStorage.clear()

            //DISPATCH TO REDUCER
            dispatch({
                type: 'LOGOUT',
                isGuest: true,
                name: null,
                modal: false
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



export { AuthContext };
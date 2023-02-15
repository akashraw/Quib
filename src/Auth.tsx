import React, { createContext, useContext, useReducer, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authReducer from './Reducer';
import { useNavigation } from '@react-navigation/native';

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
        getAuthState();
    }, [])


    // Get Auth state
    const getAuthState = async () => {
        try {
            //GET TOKEN && USER
            // let token = await AsyncStorage.getItem(TOKEN_KEY);
            let user = await AsyncStorage.getItem(USER_KEY);
            user != null ? JSON.parse(user) : null;

            if (user != null) {
                return await handleLogin(user);
            } else {
                return await handleLogout();

            }
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
            await AsyncStorage.removeItem(USER_KEY)

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
const useAuth = () => {
    useContext(AuthContext)
    // console.log(AuthContext)
    if (AuthContext === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return AuthContext;
};


export { AuthContext, useAuth };
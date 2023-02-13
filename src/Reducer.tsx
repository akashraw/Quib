//Action Types
export const LOGIN = 'authReducer/LOGIN';
export const LOGOUT = 'authReducer/LOGOUT';
export const REGISTER = 'authReducer/REGISTER';


// export type

//REDUCER
// const authReducer = (state = initialState, action: { type?: any; user?: any; }) => {
//     switch (action.type) {
//         case LOGGED_IN:{
//             let { user } = action;

//             return {...state, isLoggedIn: true, user};
//         }

//         case LOGGED_OUT:{
//             return {...state, ...initialState};
//         }

//         default:
//             return state;
//     }
// };
const authReducer = (prevState: any, action: any) => {
  console.log('hola')
  // const a = {"$$typeof": Symbol(react.context), "Consumer": {"$$typeof": Symbol(react.context), "_context": [Circular]}, "Provider": {"$$typeof": Symbol(react.provider), "_context": [Circular]}, "_currentRenderer": {}, "_currentRenderer2": null, "_currentValue": {"dispatch": [Function bound dispatchReducerAction], "getAuthState": [Function getAuthState], "handleLogin": [Function handleLogin], "handleLogout": [Function handleLogout], "isLoading": true, "userName": null}, "_currentValue2": {}, "_defaultValue": null, "_globalName": null, "_threadCount": 0}
  switch (action.type) {
    case 'RETRIEVE_TOKEN':
      return {
        ...prevState,
        userName: action.name,
        isLoading: false,
      };
    case 'LOGIN':
      return {
        ...prevState,
        userName: action.name,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...prevState,
        userName: null,
        isLoading: false,
      };
    case 'REGISTER':
      return {
        ...prevState,
        userName: action.name,
        isLoading: false,
      };
  }
};

export default authReducer;
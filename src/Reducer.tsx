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
  switch (action.type) {
    case 'RETRIEVE_TOKEN':
      return {
        ...prevState,
        userName: action.name,
        isGuest: false,
      };
    case 'LOGIN':
      return {
        ...prevState,
        userName: action.name,
        isGuest: action.isGuest,
      };
    case 'LOGOUT':
      return {
        ...prevState,
        userName: action.name,
        isGuest: action.isGuest,
      };
    case 'REGISTER':
      return {
        ...prevState,
        userName: action.name,
        isGuest: action.isGuest,
      };
  }
};

export default authReducer;
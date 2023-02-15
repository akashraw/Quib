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
    case 'MODAL':
      return {
        ...prevState,
        userName: action.name,
        isGuest: action.isGuest,
        Modal: action.modal,
      };
    case 'LOGIN':
      return {
        ...prevState,
        userName: action.name,
        isGuest: action.isGuest,
        Modal:action.modal,
      };
    case 'LOGOUT':
      return {
        ...prevState,
        userName: action.name,
        isGuest: action.isGuest,
        Modal:action.modal,
      };
    case 'REGISTER':
      return {
        ...prevState,
        userName: action.name,
        isGuest: action.isGuest,
        Modal:action.modal,
      };
  }
};

export default authReducer;
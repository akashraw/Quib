
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
        Modal: action.modal,
      };
    case 'LOGOUT':
      return {
        ...prevState,
        userName: action.name,
        isGuest: action.isGuest,
        Modal: action.modal,
      };
    case 'REGISTER':
      return {
        ...prevState,
        userName: action.name,
        isGuest: action.isGuest,
        Modal: action.modal,
      };
  }
};

export default authReducer;
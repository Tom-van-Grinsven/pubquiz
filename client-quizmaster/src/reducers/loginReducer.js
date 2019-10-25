import produce from 'immer'

export const setLoginEmail = (email) => {
    return {
        type: 'SET_LOGIN_EMAIL',
        payload: email
    }
};

export const setLoginPassword = (password) => {
    console.log(password)
    return {
        type: 'SET_LOGIN_PASSWORD',
        payload: password
    }
};

const initialState = {
    email: '',
    password: ''
};

export const loginReducer = produce((state, action) => {
    switch (action.type) {

        case 'SET_LOGIN_EMAIL':
            state.email = action.payload;
            return;

        case 'SET_LOGIN_PASSWORD':
            state.password = action.payload;
            return;

        default:
            return state
    }
}, initialState);
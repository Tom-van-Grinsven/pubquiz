import produce from 'immer'

export const setRegisterEmail = (email) => {
    return {
        type: 'SET_REGISTER_EMAIL',
        payload: email
    }
};

export const setRegisterPassword = (password) => {
    return {
        type: 'SET_REGISTER_PASSWORD',
        payload: password
    }
};

const initialState = {
    email: '',
    password: ''
};

export const registerReducer = produce((state, action) => {

    switch (action.type) {

        case 'SET_REGISTER_EMAIL':
            state.email = action.payload;
            return;

        case 'SET_REGISTER_PASSWORD':
            state.password = action.payload;
            return;

        default:
            return state
    }
}, initialState);
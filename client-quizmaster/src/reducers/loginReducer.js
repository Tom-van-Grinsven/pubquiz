import produce from 'immer'
import {clearError, setError} from "./errorReducer";

const validateLogin = (email, password) => {

    const err = [];
    if(email.length === 0) {
        err.push('Please enter an e-mailadres')
    }

    if(password.length === 0) {
        err.push('Please enter an password')
    }

    return err;

};

export const login = (email, password, history) => {
    return dispatch => {

        dispatch(clearError());
        const err = validateLogin(email, password);

        if(err.length > 0) {
            return dispatch(setError({
                login: {messages: err}
            }))
        }

        dispatch(loginRequest());
        fetch(process.env.REACT_APP_API_URL + '/sessions', {
            method: 'POST',
            headers: {
                'Content-Type': 'Application/JSON'
            },
            credentials: "include",
            body: JSON.stringify({
                email: email,
                password: password
            })
        }).then(response => {
            if(response.status === 401) {
                return Promise.reject()
            } else {
                return true
            }
        }, fetchErr => {
            dispatch(loginRequestFailure());
            dispatch(setError({
                login: {messages: [fetchErr]}
            }))
        }).then(() => {
            dispatch(loginRequestSuccess());
            history.push('/quiz');
        }, () => {
            dispatch(loginRequestFailure());
            dispatch(setError({
                login: {messages: ['E-mailadres or password incorrect']}
            }))
        })
    }
};

const loginRequest = () => {
    return {
        type: 'LOGIN_REQUEST'
    }
};

const loginRequestSuccess = () => {
    return {
        type: 'LOGIN_REQUEST_SUCCESS'
    }
};

const loginRequestFailure = () => {
    return {
        type: 'LOGIN_REQUEST_FAILURE'
    }
};


export const setLoginEmail = (email) => {
    return {
        type: 'SET_LOGIN_EMAIL',
        payload: email
    }
};

export const setLoginPassword = (password) => {
    return {
        type: 'SET_LOGIN_PASSWORD',
        payload: password
    }
};

const initialState = {
    email: '',
    password: '',
    isSending: false
};

export const loginReducer = produce((state, action) => {
    switch (action.type) {

        case 'SET_LOGIN_EMAIL':
            state.email = action.payload;
            return;

        case 'SET_LOGIN_PASSWORD':
            state.password = action.payload;
            return;

        case 'LOGIN_REQUEST':
            state.isSending = true;
            return;

        case 'LOGIN_REQUEST_SUCCESS':
        case 'LOGIN_REQUEST_FAILURE':
            state.isSending = false;
            return;

        default:
            return state
    }
}, initialState);
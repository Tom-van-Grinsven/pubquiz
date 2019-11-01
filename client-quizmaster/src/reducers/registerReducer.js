import produce from 'immer'
import {clearError, setError} from "./errorReducer";
import {setAccountIsUpdated} from "./accountReducer";

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

const validateEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

const validateRegister = (email, password) => {

    const err = [];
    if (email.length === 0) {
        err.push('Please enter an e-mailadres')
    } else if (!validateEmail(email)) {
        err.push('Please enter an valid e-mailadres')
    }

    if (password.length === 0) {
        err.push('Please enter a password')
    } else if (password.length < 6) {
        err.push('A password needs to be at least 6 characters')
    }

    return err
};

export const registerAccount = (email, password) => {
    return dispatch => {

        dispatch(clearError());
        const err = validateRegister(email, password);
        if(err.length > 0) {
            dispatch(setError({
                register: {messages: err}
            }));
            return
        }

        dispatch(registerAccountRequest());
        fetch(process.env.REACT_APP_API_URL + '/accounts', {
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
            if(response.status === 400) {
                return Promise.reject(response)
            } else {
                return true
            }
        }, fetchErr => {
            dispatch(registerAccountRequestFailure());
            dispatch(setError({
                register: {messages: [fetchErr]}
            }))
        }).then(() => {
            dispatch(registerAccountRequestSuccess());
            dispatch(setAccountIsUpdated());
        }, response => {
            dispatch(registerAccountRequestFailure());
            response.json().then((json) => {
                dispatch(setError({
                    register: {messages: [json.err]}
                }))
        }, err => dispatch(setError({
                register: {messages: [err.message]}
            })));
        })
    }
};

const registerAccountRequest = () => {
    return {
        type: 'REGISTER_ACCOUNT_REQUEST'
    }
};

const registerAccountRequestSuccess = () => {
    return {
        type: 'REGISTER_ACCOUNT_REQUEST_SUCCESS'
    }
};

const registerAccountRequestFailure = () => {
    return {
        type: 'REGISTER_ACCOUNT_REQUEST_FAILURE'
    }
};

const initialState = {
    email: '',
    password: '',
    isSending: false
};

export const registerReducer = produce((state, action) => {

    switch (action.type) {

        case 'SET_REGISTER_EMAIL':
            state.email = action.payload;
            return;

        case 'SET_REGISTER_PASSWORD':
            state.password = action.payload;
            return;

        case 'REGISTER_ACCOUNT_REQUEST':
            state.isSending = true;
            state.password = '';
            return;

        case 'REGISTER_ACCOUNT_REQUEST_SUCCESS':
        case 'REGISTER_ACCOUNT_REQUEST_FAILURE':
            state.isSending = false;
            return state;

        default:
            return state
    }
}, initialState);
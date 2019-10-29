import produce from 'immer'
import {setError} from "./errorReducer";

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

export const registerAccount = (email, password, history) => {
    return dispatch => {
        dispatch(registerAccountRequest());
        fetch(process.env.REACT_APP_API_URL + '/accounts/', {
            method: 'POST',
            headers: {
                'Content-Type': 'Application/JSON'
            },
            credentials: "include",
            body: JSON.stringify({
                email: email,
                password: password
            })
        }).then(() => {
            dispatch(registerAccountRequestSuccess());
            history.push('/quiz');
        }, err => {
            dispatch(registerAccountRequestFailure());
            dispatch(setError({
                messages: [err.message]
            }))
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
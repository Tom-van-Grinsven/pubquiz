import {produce} from "immer";
import {clearError, setError} from "./errorReducer";

export const fetchAccount = () => {
    return dispatch => {
        dispatch(clearError());
        dispatch(fetchAccountRequest());
        fetch(process.env.REACT_APP_API_URL + '/sessions', {
            method: 'GET',
            credentials: 'include'
        }).then(response => response.json(), fetchErr => {
            dispatch(setError({
                message: [fetchErr]
            }));
            dispatch(fetchAccountRequestFailure())
        }).then(account => dispatch(fetchAccountRequestSuccess(account)))
    }
};

const fetchAccountRequest = (account) => {
    return {
        type: 'FETCH_ACCOUNT_REQUEST',
    }
};

const fetchAccountRequestSuccess = (account) => {
    return {
        type: 'FETCH_ACCOUNT_REQUEST_SUCCESS',
        payload: account
    }
};

const fetchAccountRequestFailure = () => {
    return {
        type: 'FETCH_ACCOUNT_REQUEST_FAILURE',
    }
};

export const setAccountIsUpdated = () => {
    return {
        type: 'ACCOUNT_IS_UPDATED'
    }
};

const initialState = {
    isFetching: false,
    isUpdated: true,
    isLoggedIn: false,
    accInfo: {}
};

export const accountReducer = produce((state, action) => {

    switch(action.type) {

        case 'FETCH_ACCOUNT_REQUEST':
            state.isFetching = true;
            return;

        case 'FETCH_ACCOUNT_REQUEST_SUCCESS':
            state.isFetching = false;
            state.isUpdated = false;

            if(action.payload.isLoggedIn) {
                state.accInfo       = action.payload;
                state.isLoggedIn    = true;
            }
            return;

        case 'FETCH_ACCOUNT_REQUEST_FAILURE':
            state.isFetching = false;
            state.isUpdated = false;
            state.isLoggedIn = false;
            state.accInfo = {};
            return;

        case 'ACCOUNT_IS_UPDATED':
            state.isUpdated = true;
            return;

        default:
            return state;
    }

}, initialState);
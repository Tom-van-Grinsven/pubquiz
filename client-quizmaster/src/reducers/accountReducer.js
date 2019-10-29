import {produce} from "immer";
import {clearError, setError} from "./errorReducer";

const fetchAccount = () => {
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

const initialState = {
    isFetching: false,
    isUpdated: false,
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
            state.accInfo = action.payload;
            console.log(action.payload);
            return;

        case 'FETCH_ACCOUNT_REQUEST_FAILURE':
            state.isFetching = false;
            state.isUpdated = false;
            state.isLoggedIn = false;
            state.accInfo = {};
            return;

        default:
            return state;
    }

}, initialState);
import produce from "immer";
import _ from "lodash";
import {clearError, setError} from "./errorReducer";

export const getTeamInformation = () => {
    return dispatch => {

        dispatch(clearError());
        dispatch(fetchTeamRequest());
        fetch(process.env.REACT_APP_API_URL + '/sessions', {
            method: 'GET',
            credentials: 'include',
        }).then(response => response.json(), err => {
            dispatch(setError({
                message: [err.message || 'Something went wrong']
            }));
            dispatch(fetchTeamRequestFailure())
        }).then(teamInfo => {
            dispatch(fetchTeamRequestSuccess(teamInfo))
        }, err => {
            dispatch(setError({
                message: [err.message || 'Something went wrong']
            }));
            dispatch(fetchTeamRequestFailure())
        });
    }
};

const fetchTeamRequest = () => {
    return {
        type: 'FETCH_TEAM_REQUEST'
    }
};

const fetchTeamRequestSuccess = (team) => {
    return {
        type: 'FETCH_TEAM_REQUEST_SUCCESS',
        payload: team
    }
};

const fetchTeamRequestFailure = () => {
    return {
        type: 'FETCH_TEAM_REQUEST_FAILURE'
    }
};

export const teamIsAcceptanceIsPending = () => {
    return {
        type: 'TEAM_PENDING'
    }
};


const initialState = {
    isFetching: false,
    isUpdated: true,
    teamName: '',
    quizCode: '',
};

export const teamReducer = produce((state, action) => {
    switch (action.type) {

        case 'TEAM_PENDING':
        case 'TEAM_ACCEPTED':
        case 'TEAM_REJECTED':
            state.isUpdated = true;
            return;

        case 'FETCH_TEAM_REQUEST':
            state.isFetching = true;
            return;

        case 'FETCH_TEAM_REQUEST_SUCCESS':
            state.isFetching = false;
            if(!_.isEmpty(action.payload)) {
                state.teamName = action.payload.teamName;
            }
            state.isUpdated = false;
            return;

        case 'FETCH_TEAM_REQUEST_FAILURE':
            state.isFetching = false;
            state.isUpdated = false;
            return;

        default:
            return state;
    }
}, initialState);
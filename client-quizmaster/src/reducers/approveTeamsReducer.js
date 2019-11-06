import {produce} from "immer";
import {clearError, setError} from "./errorReducer";


export const fetchTeams = (quizCode) => {
    return dispatch => {
        dispatch(fetchTeamsRequest());
        fetch(process.env.REACT_APP_API_URL + '/quizzes/' + quizCode + '/teams', {
            method: 'GET',
            credentials: 'include'
        })
            .then(response => response.json())
            .then(teams => dispatch(fetchTeamsRequestSuccess(teams)),
                err => dispatch(fetchTeamsRequestFailure(err)))
    }
};

export const fetchTeamsRequest = () => {
  return {
      type: 'FETCH_TEAMS_REQUEST'
  }
};

export const fetchTeamsRequestSuccess = (teams) => {
    return {
        type: 'FETCH_TEAMS_REQUEST_SUCCESS',
        payload: teams
    }
};

export const fetchTeamsRequestFailure = (err) => {
    return {
        type: 'FETCH_TEAMS_REQUEST_FAILURE',
        payload: err
    }
};

export const updateTeamStatus = (teamName, status) => {
    return {
        type: 'UPDATE_TEAM_STATUS',
        payload: {
            teamName: teamName,
            status: status
        }
    }
};

export const approveTeams = (approvedTeams, quizCode, done) => {
    return dispatch => {

        dispatch(approveTeamsRequest());
        fetch(process.env.REACT_APP_API_URL + '/quizzes/' + quizCode + '/teams', {
            method: 'PUT',
            headers: {
                'Content-Type': 'Application/JSON'
            },
            credentials: "include",
            body: JSON.stringify(approvedTeams)
        }).then(() => {
                dispatch(approveTeamsRequestSuccess(approvedTeams));
                dispatch(clearError());
                done();
            },
            err => {
                dispatch(approveTeamsRequestFailure());
                dispatch(setError({
                    messages: [err.message]
                }))
        })
    }
};

const approveTeamsRequest = () => {
    return {
        type: 'APPROVE_TEAMS_REQUEST'
    }
};

const approveTeamsRequestSuccess = (approvedTeams) => {
    return {
        type: 'APPROVE_TEAMS_REQUEST_SUCCESS',
        payload: approvedTeams
    }
};

const approveTeamsRequestFailure = () => {
    return {
        type: 'APPROVE_TEAMS_REQUEST_FAILURE',
    }
};



export const updateApprovedTeams = (approvedTeams) => {
    return {
        type: 'UPDATE_APPROVED_TEAMS',
        payload: approvedTeams
    }
};

export const setTeamsUpdated = () => {
    return {
        type: 'UPDATE_JOINED_TEAMS'
    }
};

const initialState = {
    "isFetching": false,
    "isSending": false,
    "isUpdated": true,
    "teams": []
};

export const approveTeamsReducer = produce((state, action) => {

    switch (action.type) {

        case 'FETCH_TEAMS_REQUEST':
            state.isFetching = true;
            return;

        case 'FETCH_TEAMS_REQUEST_SUCCESS':
            state.isFetching = false;
            state.isUpdated = false;
            state.teams = action.payload;
            return;

        case 'FETCH_TEAMS_REQUEST_FAILURE':
            state.isFetching = false;
            state.isUpdated = false;
            state.err = action.payload;
            return;

        case 'UPDATE_TEAM_STATUS':
            state.teams.forEach((team, index) => {
                if(team.teamName === action.payload.teamName) {
                    state.teams[index].approved = action.payload.status
                }
            });
            return;

        case 'UPDATE_JOINED_TEAMS':
            state.isUpdated = true;
            return state;

        case 'APPROVE_TEAMS_REQUEST':
            state.isSending = true;
            return state;

        case 'APPROVE_TEAMS_REQUEST_SUCCESS':
            state.teams = state.teams.filter(team => action.payload.includes(team.teamName));
            state.isSending = false;
            return state;

        case 'APPROVE_TEAMS_REQUEST_FAILURE':
            state.isSending = false;
            return state;

        default:
            return state

    }
}, initialState);
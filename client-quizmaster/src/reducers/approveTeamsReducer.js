import {produce} from "immer";
import {clearError, setError} from "./errorReducer";


export const fetchTeams = (quizCode) => {
    return dispatch => {
        dispatch(fetchTeamsRequest());
        fetch(process.env.REACT_APP_API_URL + '/quizzes/' + quizCode + '/teams')
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

export const approveTeams = (teams, quizCode, history) => {
    return dispatch => {

        console.log(history)
        const err = [];
        const approvedTeams = teams.filter(team => team.approved === true).map(approvedTeam => approvedTeam.teamName);
        const rejectedTeams = teams.filter(team => team.approved === false);

        if(approvedTeams.length < 2) {
            err.push('You need to approve at least two team in order for the quiz to be playable')
        }

        if((approvedTeams.length + rejectedTeams.length) !== teams.length) {
            err.push('Not all teams have been approved or rejected')
        }

        if(!quizCode) {
            err.push('A system error has occurred, please contact an administrator if the problem persists')
        }

        if(err.length > 0) {
            return dispatch(setError({
                messages: err,
                code: 'NUMBER_OF_TEAMS_APPROVED'
            }));
        }

        console.log(JSON.stringify(approvedTeams));
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
                history.push('/quiz/' + quizCode + '/select-categories')
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
        type: 'TEAMS_UPDATED'
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

        case 'TEAMS_UPDATED':
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
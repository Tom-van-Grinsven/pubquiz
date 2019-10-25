import {produce} from "immer";


export const fetchTeams = () => {
    return dispatch => {
        dispatch(fetchTeamsRequest())
        return new Promise((resolve, reject) => {
            resolve([{
                "name": "Team1",
            },{
                "name": "Team2",
            },{
                "name": "Team3",
            },{
                "name": "Team4",
            }, {
                "name": "Team5",
            }])
        }).then(teams => dispatch(fetchTeamsRequestSuccess(teams)),
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

export const approveTeams = (approvedTeams, history) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            resolve(approvedTeams);
        }).then(approvedTeams => {
            dispatch(updateApprovedTeams(approvedTeams));
            history.push('/quiz/select-categories')
        })
    }
};

export const updateApprovedTeams = (approvedTeams) => {
    return {
        type: 'UPDATE_APPROVED_TEAMS',
        payload: approvedTeams
    }
}

const initialState = {
    "isFetching": false,
    "isSending": false,
    "teams": []
};

export const approveTeamsReducer = produce((state, action) => {

    switch (action.type) {

        case 'FETCH_TEAMS_REQUEST':
            state.isFetching = true;
            return;

        case 'FETCH_TEAMS_REQUEST_SUCCESS':
            state.isFetching = false;
            state.teams = action.payload;
            return;

        case 'FETCH_TEAMS_REQUEST_FAILURE':
            state.isFetching = false;
            state.err = action.payload;
            return;

        case 'UPDATE_TEAM_STATUS':
            state.teams.forEach((team, index) => {
                if(team.name === action.payload.teamName) {
                    state.teams[index].approved = action.payload.status
                }
            });
            return;

        case 'UPDATE_APPROVED_TEAMS':
            state.teams = state.teams.filter(team => action.payload.includes(team.name));
            return;

        default:
            return state

    }
}, initialState);
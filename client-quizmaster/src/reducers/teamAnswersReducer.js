import {produce} from "immer";

export const fetchTeamAnswers = () => {
    return dispatch => {
        dispatch(fetchTeamAnswersRequest())
        return new Promise((resolve, reject) => {
            resolve([{
                team: 'Team 1',
                answer: 'Geen Idee'
            }, {
                team: 'Team 2',
                answer: 'Geen Idee'
            },  {
                team: 'Team 3',
                answer: 'Geen Idee'
            },  {
                team: 'Team 4',
                answer: 'Geen Idee'
            },  {
                team: 'Team 5',
                answer: 'Geen Idee'
            },  {
                team: 'Team 6',
                answer: 'Geen Idee'
            },  {
                team: 'Team 7',
                answer: 'Geen Idee'
            }, {
                team: 'Team 8',
                answer: 'Geen Idee'
            }])
        }).then(answers => dispatch(fetchTeamAnswersRequestSuccess(answers)), err => dispatch(fetchTeamAnswersRequestFailure(err)))
    }
};

const fetchTeamAnswersRequest = () => {
    return {
        type: 'FETCH_TEAM_ANSWERS_REQUEST'
    }
};

const fetchTeamAnswersRequestSuccess = (answers) => {
    return {
        type: 'FETCH_TEAM_ANSWERS_REQUEST_SUCCESS',
        payload: answers
    }
};

const fetchTeamAnswersRequestFailure = (err) => {
    return {
        type: 'FETCH_TEAM_ANSWERS_REQUEST_FAILURE',
        payload: err,
    }
};

const initialState = {
    isFetching: false,
    isSending: false,
    answers: []
};

export const teamAnswersReducer = produce((state, action) => {
    switch (action.type) {

        case 'FETCH_TEAM_ANSWERS_REQUEST':
            state.isFetching = true;
            return;

        case 'FETCH_TEAM_ANSWERS_REQUEST_SUCCESS':
            state.isFetching = false;
            state.answers = action.payload;
            return;

        case 'FETCH_TEAM_ANSWERS_REQUEST_FAILURE':
            state.isFetching = false;
            state.err = action.payload;
            return;

        default:
            return state;
    }
}, initialState);
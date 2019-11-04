import {produce} from "immer";
import {clearError, setError} from "./errorReducer";

export const fetchTeamAnswers = (quizCode) => {
    return dispatch => {
        dispatch(clearError);
        dispatch(fetchTeamAnswersRequest());
        fetch(process.env.REACT_APP_API_URL + '/quizzes/' + quizCode + '/active-questions/answers', {
            method: 'GET',
            credentials: 'include'
        }).then(response => response.json(), err => {
            dispatch(fetchTeamAnswersRequestFailure(err));
            dispatch(setError({
                message: [err]
            }));
        }).then(answers => dispatch(fetchTeamAnswersRequestSuccess(answers)), err => {
            dispatch(fetchTeamAnswersRequestFailure(err));
            dispatch(setError({
                message: [err]
            }));
        })
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

const fetchTeamAnswersRequestFailure = () => {
    return {
        type: 'FETCH_TEAM_ANSWERS_REQUEST_FAILURE',
    }
};

const initialState = {
    isFetching: false,
    isSending: false,
    isUpdated: true,
    answers: []
};

export const teamAnswersReducer = produce((state, action) => {
    switch (action.type) {

        case 'FETCH_TEAM_ANSWERS_REQUEST':
            state.isFetching = true;
            return;

        case 'FETCH_TEAM_ANSWERS_REQUEST_SUCCESS':
            state.isFetching = false;
            state.isUpdated = false;
            state.answers = action.payload.answers;
            return;

        case 'FETCH_TEAM_ANSWERS_REQUEST_FAILURE':
            state.isFetching = false;
            state.isUpdated = false;
            return;

        case 'UPDATE_CLOSED_ACTION':
        case 'UPDATE_JUDGED_QUESTIONS':
            state.isUpdated = true;
            return;

        default:
            return state;
    }
}, initialState);
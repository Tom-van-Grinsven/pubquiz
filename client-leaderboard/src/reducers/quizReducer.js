import produce from "immer";
import {clearError, setError} from "./errorReducer";
import {setupSocketConnection} from "./webSocketReducer";

export const fetchQuiz = (quizCode) => {
    return dispatch => {
        dispatch(clearError());
        dispatch(fetchQuizRequest());
        fetch(process.env.REACT_APP_API_URL + '/quizzes/' + quizCode, {
            method: 'GET',
            credentials: 'include'
        }).then(response => response.json(), err => {
            dispatch(fetchQuizRequestFailure())
            dispatch(setError({
                message: [err]
            }));
        }).then(quiz => dispatch(fetchQuizRequestSuccess(quiz)), err => {
            dispatch(fetchQuizRequestFailure(err));
            dispatch(setError({
                message: [err]
            }));
        })
    }
};

const fetchQuizRequest = () => {
    return {
        type: 'FETCH_QUIZ_REQUEST',
    }
};

const fetchQuizRequestSuccess = (quiz) => {
    return {
        type: 'FETCH_QUIZ_REQUEST_SUCCESS',
        payload: quiz
    }
};

const fetchQuizRequestFailure = () => {
    return {
        type: 'FETCH_QUIZ_REQUEST_FAILURE',
    }
};
export const resetHasFetched = () => {
    return {
        type: 'RESET_HAS_FETCHED'
    }
};

const initialState = {
    isFetching: false,
    isSending: false,
    isUpdated: false,
    hasFetched: false,
};

export const quizReducer = produce((state, action) => {

    switch (action.type) {

        case 'RESET_HAS_FETCHED':
            state.hasFetched = false;
            return;

        case 'UPDATE_QUIZ_ENDED':
        case 'UPDATE_DEFINITIVE_TEAMS':
            state.isUpdated = true;
            return;

        case 'FETCH_QUIZ_REQUEST':
            state.isFetching = true;
            return state;

        case 'FETCH_QUIZ_REQUEST_SUCCESS':

            state.hasFetched    = true;
            state.isFetching    = false;
            state.isUpdated     = false;
            if(action.payload) {
                const quiz = action.payload;
                state.isActive      = quiz.isActive;
                state.isOpen        = quiz.isOpen;
                state.roundNr       = quiz.roundNumber;
                state.questionNr    = quiz.questionNumber;
                state.name          = quiz.name;
                state.code          = quiz.code;
            }
            return state;

        case 'FETCH_QUIZ_REQUEST_FAILURE':
            state.isFetching = false;
            state.isUpdated = false;
            state.hasFetched    = true;
            return state;

        default:
            return state
    }
}, initialState);


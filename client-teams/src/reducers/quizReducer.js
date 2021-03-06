import produce from "immer";
import {clearError, setError} from "./errorReducer";


export const fetchQuiz = (quizCode) => {
    return dispatch => {
        dispatch(clearError());
        dispatch(fetchQuizRequest());
        fetch(process.env.REACT_APP_API_URL + '/quizzes/' + quizCode, {
            method: 'GET',
            credentials: 'include'
        }).then(response => response.json(), err => {
            dispatch(fetchQuizRequestFailure());
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

const initialState = {
    isFetching: false,
    isSending: false,
    isUpdated: false,
    nameInput: ''
};



export const quizReducer = produce((state, action) => {

    switch (action.type) {

        case 'FETCH_QUIZ_REQUEST':
            state.isFetching = true;
            return state;

        case 'FETCH_QUIZ_REQUEST_SUCCESS':
            const quiz = action.payload;
            state.isFetching    = false;
            state.isUpdated     = false;
            state.isOpen        = quiz.isOpen;
            state.isActive      = quiz.isActive;
            state.roundNr       = quiz.roundNumber;
            state.questionNr    = quiz.questionNumber;
            state.name          = quiz.name;
            state.code          = quiz.code;
            return state;

        case 'FETCH_QUIZ_REQUEST_FAILURE':
            state.isFetching = false;
            state.isUpdated = false;
            return state;


        case "UPDATE_QUIZ_ENDED":
        case 'TEAM_REJECTED':
        case 'TEAM_ACCEPTED':
            state.isUpdated = true;
            return

        default:
            return state
    }
}, initialState);


import produce from "immer";
import {clearError, setError} from "./errorReducer";
import {setupSocketConnection} from "./webSocketReducer";

export const createQuiz = (quizName, history) => {
    return dispatch => {
        if(quizName.length === 0) {
            dispatch(setError({
                messages: ['Please enter a Quiz Name'],
                code: 'QUIZ_NAME'
            }));
            return;
        }

        dispatch(clearError());
        dispatch(createQuizRequest());
        fetch(process.env.REACT_APP_API_URL + '/quizzes', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            body: JSON.stringify({quizName: quizName})
        }).then(response => response.json(), err => {
            dispatch(createQuizRequestFailure());
            dispatch(setError({
                message: [err]
            }));
        }).then(quiz => {
                dispatch(createQuizRequestSuccess(quiz.quizCode));
                history.push('/quiz/' + quiz.quizCode + '/approve-teams')
            }, err => {
            dispatch(createQuizRequestFailure());
            dispatch(setError({
                message: [err]
            }));
        })
    }
};

const createQuizRequest = () => {
    return {
        type: 'CREATE_QUIZ_REQUEST'
    }
};

const createQuizRequestSuccess = (quizCode) => {
    return {
        type: 'CREATE_QUIZ_REQUEST_SUCCESS',
        payload: quizCode
    }
};

const createQuizRequestFailure = () => {
    return {
        type: 'CREATE_QUIZ_REQUEST_FAILURE',
    }
};

export const setQuizName = (quizName) => {
    return {
        type: 'SET_QUIZ_NAME',
        payload: quizName
    }
};

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
            dispatch(fetchQuizRequestFailure(err))
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

export const incrementRoundNr = () => {
    return {
        type: 'INCREMENT_ROUND_NR'
    }
};

export const incrementQuestionNr= () => {
    return {
        type: 'INCREMENT_QUESTION_NR'
    }
};

export const resetQuestionNr = () => {
    return {
        type: 'RESET_QUESTION_NR'
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

        case 'INCREMENT_ROUND_NR':
            state.roundNr++;
            return;

        case 'INCREMENT_QUESTION_NR':
            state.questionNr++;
            return;

        case 'RESET_QUESTION_NR':
            state.questionNr = 0;
            return;

        case 'FETCH_QUIZ_REQUEST':
            state.isFetching = true;
            return state;

        case 'FETCH_QUIZ_REQUEST_SUCCESS':
            const quiz = action.payload;
            state.isFetching    = false;
            state.isUpdated     = false;
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

        case 'CREATE_QUIZ_REQUEST':
            state.isSending = true;
            return;

        case 'CREATE_QUIZ_REQUEST_SUCCESS':
            state.isSending = false;
            state.code = action.payload;
            state.isUpdated = true;
            return;

        case 'CREATE_QUIZ_REQUEST_FAILURE':
            state.isSending = false;
            return;

        case 'SET_QUIZ_NAME':
            state.nameInput = action.payload;
            return;

        default:
            return state
    }
}, initialState);


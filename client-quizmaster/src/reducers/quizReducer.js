import produce from "immer";
import {clearError, setError} from "./errorReducer";
import {setupSocketConnection} from "./WebSocketReducer";

export const createQuiz = (quizName, history) => {
    return dispatch => {
        if(quizName.length === 0) {
            dispatch(setError({
                messages: ['Please enter a Quiz Name'],
                code: 'QUIZ_NAME'
            }));
            return;
        }

        dispatch(createQuizRequest());
        fetch(process.env.REACT_APP_API_URL + '/quizzes', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({quizName: quizName})
        })
            .then(response => response.json())
            .then(quizCode => {
                dispatch(setupSocketConnection());
                dispatch(createQuizRequestSuccess(quizCode));
                dispatch(clearError());
                history.push('/quiz/' + quizCode + '/approve-teams')
        }, err => {
            dispatch(createQuizRequestFailure(err))
        })
    }
};

export


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

const createQuizRequestFailure = (err) => {
    console.log(err);
    return {
        type: 'CREATE_QUIZ_REQUEST_FAILURE',
        payload: err
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
        dispatch(fetchQuizRequest());
        fetch(process.env.REACT_APP_API_URL + '/quizzes/' + quizCode)
            .then(response => response.json(), err => dispatch(fetchQuizRequestFailure(err)))
            .then(quiz => {console.log(quiz); dispatch(fetchQuizRequestSuccess(quiz))}, err => dispatch(fetchQuizRequestFailure(err)))
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

const fetchQuizRequestFailure = (err) => {
    return {
        type: 'FETCH_QUIZ_REQUEST_FAILURE',
        payload: err
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
            state.isActive      = quiz.isActive;
            state.roundNr       = quiz.roundNumber;
            state.questionNr    = quiz.questionNr;
            state.name          = quiz.name;
            state.code          = quiz.code;
            return state;

        case 'FETCH_QUIZ_REQUEST_FAILURE':
            state.err = action.payload;
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
            state.err = action.payload;
            return;

        case 'SET_QUIZ_NAME':
            state.nameInput = action.payload;
            return;

        default:
            return state
    }
}, initialState);


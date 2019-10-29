import {produce} from "immer";
import _ from 'lodash'
import {clearError, setError} from "./errorReducer";


export const fetchActiveQuestion = (quizCode) => {
    return dispatch => {
        dispatch(clearError());
        dispatch(fetchActiveQuestionRequest());
        fetch(process.env.REACT_APP_API_URL + '/quizzes/' + quizCode + '/active-questions', {
            method: 'GET',
            credentials: 'include'
        }).then(response => response.json(), err => {
            dispatch(fetchActiveQuestionRequestFailure());
            dispatch(setError({
                message: [err]
            }));
        })
        .then(question => dispatch(fetchActiveQuestionRequestSuccess(question)), err => {
            dispatch(fetchActiveQuestionRequestFailure());
            dispatch(setError({
                message: [err]
            }));
        })
    }
};

const fetchActiveQuestionRequest = () => {
    return {
        type: 'FETCH_ACTIVE_QUESTION'
    }
};

const fetchActiveQuestionRequestSuccess = (activeQuestion) => {
    return {
        type: 'FETCH_ACTIVE_QUESTION_SUCCESS',
        payload: activeQuestion
    }
};

const fetchActiveQuestionRequestFailure = () => {
    return {
        type: 'FETCH_ACTIVE_QUESTION_FAILURE',
    }
};

export const setActiveQuestionIsUpdated = (status) => {
    return {
        type: 'ACTIVE_QUESTION_IS_UPDATED',
        payload: status
    }
};

export const sendCloseQuestion = (quizCode) => {
    return dispatch => {
        dispatch(clearError());
        dispatch(sendCloseQuestionRequest());
        fetch(process.env.REACT_APP_API_URL + '/quizzes/' + quizCode + '/active-questions', {
            method: 'PUT',
            headers: {
                'Content-Type': 'Application/JSON'
            },
            credentials: 'include',
            body: JSON.stringify({ closed: true })
        }).then(() => dispatch(sendCloseQuestionSuccess()), err => {
            dispatch(setError({
                message: [err]
            }));
            sendCloseQuestionRequestFailure()
        })
    }
};

const sendCloseQuestionRequest = () => {
    return {
        type: 'SEND_CLOSE_QUESTION_REQUEST'
    }
};

const sendCloseQuestionSuccess = () => {
    return {
        type: 'SEND_CLOSE_QUESTION_REQUEST_SUCCESS'
    }
};

const sendCloseQuestionRequestFailure = () => {
    return {
        type: 'SEND_CLOSE_QUESTION_REQUEST_FAILURE',
    }
};

export const clearActiveQuestion = () => {
    return {
        type: 'CLEAR_ACTIVE_QUESTION'
    }
};

const initialState = {
    isFetching: false,
    isUpdated: true,
    question: null,
};

export const activeQuestionReducer = produce((state, action) => {

    switch (action.type) {

        case 'ACTIVE_QUESTION_IS_UPDATED':
            state.isUpdated = action.payload;
            return;

        case 'FETCH_ACTIVE_QUESTION':
            state.isFetching = true;
            return;

        case 'FETCH_ACTIVE_QUESTION_SUCCESS':
            state.isFetching = false;
            state.isUpdated = false;
            if(!_.isEmpty(action.payload)) {
                state.question = action.payload;
            }
            return;

        case 'FETCH_ACTIVE_QUESTION_FAILURE':
            state.isFetching = false;
            return;

        case 'SEND_CLOSE_QUESTION_REQUEST':
            state.isSending = true;
            return;

        case 'SEND_CLOSE_QUESTION_REQUEST_SUCCESS':
            state.isSending = false;
            state.question.isClosed = true;
            return;

        case 'SEND_CLOSE_QUESTION_REQUEST_FAILURE':
            state.isSending = false;
            state.err = action.payload;
            return;

        case 'CLEAR_ACTIVE_QUESTION':
            state.question = null;
            state.isUpdated = false;
            return;

        default:
            return state

    }

}, initialState);

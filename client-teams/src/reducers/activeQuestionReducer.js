import produce from 'immer';
import _ from 'lodash';
import {clearError, setError} from './errorReducer';

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
        }).then(question => dispatch(fetchActiveQuestionRequestSuccess(question)), err => {
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
    };
};

const initialState = {
    question: null,
    isFetching: false,
    isUpdated: true,
    quizClosed: false,
};

export const activeQuestionReducer = produce((state, action) => {

    switch(action.type){

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

        case 'UPDATE_ACTIVE_QUESTION':
            state.isUpdated = true;
            return state;

        case 'UPDATE_CLOSED_QUESTION':
            state.question.isClosed = true;
            return state;

        case 'FETCH_ACTIVE_QUESTION_FAILURE':
            state.isFetching = false;
            return;

        case "UPDATE_QUIZ_ENDED":
            state.quizClosed = true;
            return;

        default:
            return state
    }
}, initialState);


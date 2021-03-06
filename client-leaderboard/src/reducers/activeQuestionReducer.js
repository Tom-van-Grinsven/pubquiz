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
};

export const activeQuestionReducer = produce((state, action) => {

    switch(action.type){

        case 'UPDATE_CLOSED_ACTION':
        case 'UPDATE_ACTIVE_QUESTION':
        case 'UPDATE_JUDGED_QUESTIONS':
            state.isUpdated = true;
            return;

        case 'FETCH_ACTIVE_QUESTION':
            state.isFetching = true;
            return;

        case 'FETCH_ACTIVE_QUESTION_SUCCESS':
            state.isFetching = false;
            state.isUpdated = false;
            if(!_.isEmpty(action.payload)) {
                state.question = action.payload;
            } else {
                state.question = null
            }
            return;

        case 'FETCH_ACTIVE_QUESTION_FAILURE':
            state.isFetching = false;
            return;

        default:
            return state
    }
}, initialState);


import produce from 'immer'
import {clearError, setError} from './errorReducer';
import {fetchQuiz, resetHasFetched} from "./quizReducer";

export const joinQuiz = (quizCode) => {
    return dispatch => {
        dispatch(resetHasFetched());
        dispatch(fetchQuiz(quizCode))
    }
};

export const setQuizCode = (quizCode) => {
    return {
        type: 'SET_QUIZ_CODE',
        payload: quizCode
    }
};

const initialState = {
    quizCode: '',
};

export const joinQuizReducer = produce((state, action) => {
    switch (action.type) {

        case 'SET_QUIZ_CODE':
            state.quizCode = action.payload;
            return;

        default:
            return state
    }
}, initialState);


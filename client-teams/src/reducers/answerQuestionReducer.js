import produce from 'immer';
import {clearError, setError} from './errorReducer';

export const setAnswer = (answer) => {
    return {
        type: 'SET_ANSWER',
        payload: answer
    }
};

export const sendAnswer = (quizCode, teamName, answer) => {
    return dispatch => {
        dispatch(clearError());
        //dispatch(sendActiveQuestionRequest());
        fetch(process.env.REACT_APP_API_URL + '/quizzes/' + quizCode + '/active-questions/answers', {
            method: 'PUT',
            headers: {
                'Content-Type': 'Application/JSON'
            },
            credentials: 'include',
            body: JSON.stringify({
                'answer': answer,
                'teamName': teamName
            })
        }).then(() => {
            // dispatch(sendActiveQuestionRequestSuccess())
            // dispatch(setActiveQuestionIsUpdated(true))
            //history.push('/quiz/' + quizCode);

        }, err => {
            dispatch(setError({
                message: [err]
            }));
            //dispatch(sendActiveQuestionRequestFailure())
        });

    }
};

const initialState = {
    isSending: false,
    answer: ''
};

export const answerQuestionReducer = produce((state, action) => {
    switch (action.type) {

        case 'SET_ANSWER':
            state.answer = action.payload;
            return;

        default:
            return state;
    }
}, initialState);
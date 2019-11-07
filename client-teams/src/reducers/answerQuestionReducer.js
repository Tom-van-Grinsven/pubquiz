import produce from 'immer';
import {clearError, setError} from './errorReducer';


export const setAnswer = (answer) => {
    return {
        type: 'SET_ANSWER',
        payload: answer
    }
};

export const fetchTeamAnswers = (quizCode, teamName) => {
    return dispatch => {
        dispatch(clearError);
        dispatch(fetchTeamAnswersRequest());
        fetch(process.env.REACT_APP_API_URL + '/quizzes/' + quizCode + '/active-questions/answers', {
            method: 'GET',
            credentials: 'include'
        }).then(response => response.json(), err => {
            dispatch(fetchTeamAnswersRequestFailure());
            dispatch(setError({
                message: [err]
            }));
        }).then(answers => dispatch(fetchTeamAnswersRequestSuccess(answers, teamName)), err => {
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


const fetchTeamAnswersRequestSuccess = (answers, teamName) => {
    return {
        type: 'FETCH_TEAM_ANSWERS_REQUEST_SUCCESS',
        payload: {
            teamName: teamName,
            ...answers
        }
    }
};

const fetchTeamAnswersRequestFailure = () => {
    return {
        type: 'FETCH_TEAM_ANSWERS_REQUEST_FAILURE',
    }
};

export const sendAnswer = (quizCode, answer) => {

    return dispatch => {
        dispatch(clearError());
        dispatch(sendAnswerRequest());
        fetch(process.env.REACT_APP_API_URL + '/quizzes/' + quizCode + '/active-questions/answers', {
            method: 'PUT',
            headers: {
                'Content-Type': 'Application/JSON'
            },
            credentials: 'include',
            body: JSON.stringify({
                'answer': answer,
            })
        }).then(() => {
            dispatch(sendAnswerRequestSuccess())
        }, err => {
            dispatch(sendAnswerRequestFailure());
            dispatch(setError({
                message: [err.message || 'Something went wrong']
            }));

        });

    }
};

const sendAnswerRequest = () => {
    return {
        type: 'SEND_ANSWER_REQUEST'
    }
};

const sendAnswerRequestSuccess = () => {
    return {
        type: 'SEND_ANSWER_REQUEST_SUCCESS'
    }
};
const sendAnswerRequestFailure = () => {
    return {
        type: 'SEND_ANSWER_REQUEST_FAILURE'
    }
};

const initialState = {
    isSending: false,
    isFetching: false,
    hasFetched: false,
    isUpdated: true,
    answer: '',
    isRight: false
};

export const answerQuestionReducer = produce((state, action) => {
    switch (action.type) {

        case 'FETCH_ACTIVE_QUESTION_SUCCESS':
            const {isActive, isClosed, isValidated } = action.payload;
            if(isActive && !isClosed && !isValidated) {
                state.answer = '';
            }
            return;

        case 'FETCH_TEAM_ANSWERS_REQUEST':
            state.isFetching = true;
            return;

        case 'FETCH_TEAM_ANSWERS_REQUEST_SUCCESS':
            state.isFetching = false;
            state.isUpdated = false;
            const {answers, teamName} = action.payload;
            if(answers.length > 0) {
                const teamAnswer = answers.find(answer => answer.teamName === teamName);
                if(teamAnswer) {
                    state.answer = teamAnswer.givenAnswer;
                    state.isRight = teamAnswer.isRight;
                }
            }
            return;

        case 'FETCH_TEAM_ANSWERS_REQUEST_FAILURE':
            state.isFetching = false;
            state.isUpdated = false;
            return;

        case 'UPDATE_JUDGED_QUESTIONS':
            state.isUpdated = true;
            return;

        case 'SET_ANSWER':
            state.answer = action.payload;
            state.isRight = false;
            return;

        case 'SEND_ANSWER_REQUEST':
            state.isSending = true;
            return;

        case 'SEND_ANSWER_REQUEST_SUCCESS':
        case 'SEND_ANSWER_REQUEST_FAILURE':
            state.isSending = false;
            return;

        default:
            return state;
    }
}, initialState);
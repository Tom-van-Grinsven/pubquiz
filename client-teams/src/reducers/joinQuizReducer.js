import produce from 'immer'
import {clearError, setError} from './errorReducer';

export const setQuizCode = (quizCode) => {
    return {
        type: 'SET_QUIZ_CODE',
        payload: quizCode
    }
};

export const setTeamName = (teamName) => {
    return {
        type: 'SET_TEAM_NAME',
        payload: teamName
    }
};

export const joinQuiz = (quizCode, teamName, history) => {
    return dispatch => {
        dispatch(clearError());
        //dispatch(sendActiveQuestionRequest());
        fetch(process.env.REACT_APP_API_URL + '/quizzes/' + quizCode + '/teams', {
            method: 'POST',
            headers: {
                'Content-Type': 'Application/JSON'
            },
            credentials: 'include',
            body: JSON.stringify({
                'teamName': teamName
            })
        }).then(() => {
            // dispatch(sendActiveQuestionRequestSuccess())
            // dispatch(setActiveQuestionIsUpdated(true))
            history.push('/quiz/' + quizCode);

        }, err => {
            dispatch(setError({
                message: [err]
            }));
            //dispatch(sendActiveQuestionRequestFailure())
        });

    }
};

const initialState = {
    quizCode: '',
    teamName: '',
    isSending: false,
};

export const joinQuizReducer = produce((state, action) => {
    switch (action.type) {

        case 'SET_QUIZ_CODE':
            state.quizCode = action.payload;
            return;

        case 'SET_TEAM_NAME':
            state.teamName = action.payload;
            return;

        default:
            return state
    }
}, initialState);


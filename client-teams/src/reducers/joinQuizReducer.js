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
        if(teamName.length === 0) {
            dispatch(setError({
                joinquiz: {
                    messages: ['Please enter a Team name'],
                    code: 'TEAM_NAME'
                }
            }));
            return;
        }

        if(quizCode.length === 0){
            dispatch(setError({
                joinquiz: {
                    messages: ['Please enter a Quiz code'],
                    code: 'QUIZ_CODE'
                }
            }));
            return;
        }

        dispatch(clearError());
        fetch(process.env.REACT_APP_API_URL + '/quizzes/' + quizCode + '/teams', {
            method: 'POST',
            headers: {
                'Content-Type': 'Application/JSON'
            },
            credentials: 'include',
            body: JSON.stringify({
                'teamName': teamName,
                'quizCode': quizCode,
            })
        }).then(response => {
            if(response.status === 404 || response.status === 400 || response.status === 403){
                return Promise.reject(response.status);
            } else {
                return true;
            }
        }, fetchErr =>  {
            dispatch(setError({
                joinquiz: {messages: [fetchErr]}
            }))
        }).then(() => {
            history.push('/quiz/' + quizCode);
        }, (responseStatus) => {

            if(responseStatus === 404){
                dispatch(setError({
                    joinquiz: {messages: ["This Quiz does not exist"]}
                }))
            } else if(responseStatus === 400){
                dispatch(setError({
                    joinquiz: {messages: ["This Team name is already taken"]}
                }))
            } else if (responseStatus === 403) {
                dispatch(setError( {
                    joinquiz: {messages: ["You can not apply as a Team for this Quiz"]}
                }));
            }
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


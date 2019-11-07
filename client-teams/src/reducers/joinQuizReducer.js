import produce from 'immer'
import {clearError, setError} from './errorReducer';
import {teamIsAcceptanceIsPending} from "./teamReducer";

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

const joinQuizRequest = () => {
    return {
        type: 'JOIN_QUIZ_REQUEST'
    }
};

const joinQuizRequestSuccess = () => {
    return {
        type: 'JOIN_QUIZ_REQUEST_SUCCESS'
    }
};

const joinQuizRequestFailure = () => {
    return {
        type: 'JOIN_QUIZ_REQUEST_FAILURE'
    }
}


export const joinQuiz = (quizCode, teamName, callback) => {
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
        dispatch(joinQuizRequest());
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
            dispatch(joinQuizRequestFailure());
            dispatch(setError({
                joinquiz: {messages: [fetchErr.message || 'Something went wrong']}
            }))
        }).then(() => {
            dispatch(joinQuizRequestSuccess());
            dispatch(teamIsAcceptanceIsPending());
            callback(quizCode);
        }, (responseStatus) => {

            dispatch(joinQuizRequestFailure());
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

        case 'JOIN_QUIZ_REQUEST':
            state.isSending = true;
            return;

        case 'JOIN_QUIZ_REQUEST_SUCCESS':
        case 'JOIN_QUIZ_REQUEST_FAILURE':
            state.isSending = false;
            return;

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


import produce from 'immer';
import {clearError, setError} from './errorReducer';
import _ from "lodash";

export const getTeamInformation = () => {
    return dispatch => {
        dispatch(clearError());
        dispatch(fetchTeam());
        fetch(process.env.REACT_APP_API_URL + '/sessions', {
            method: 'GET',
            credentials: 'include',
        }).then(response => response.json(), err => {

            dispatch(fetchTeamRequestFailure())
        }).then(teamInfo => {
            dispatch(fetchTeamRequestSuccess(teamInfo))
        }, err => {
            console.log(' error ');
            dispatch(setError({
                message: [err]
            }));
            dispatch(fetchTeamRequestFailure())
        });
    }
};

const fetchTeam = () => {
    return {
        type: 'FETCH_TEAM_REQUEST'
    }
};

const fetchTeamRequestSuccess = (team) => {
    return {
        type: 'FETCH_TEAM_REQUEST_SUCCESS',
        payload: team
    }
};

const fetchTeamRequestFailure = () => {
    console.log(' in de request failure ');
    return {
        type: 'FETCH_TEAM_REQUEST_FAILURE'
    }
};

export const setAnswer = (answer) => {
    return {
        type: 'SET_ANSWER',
        payload: answer
    }
};

export const sendAnswer = (quizCode, teamName, answer) => {

    console.log(' hiero ');
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
    isFetching: false,
    hasFetched: false,
    teamName: '',
    quizCode: '',
    answer: ''
};

export const answerQuestionReducer = produce((state, action) => {
    switch (action.type) {

        case 'FETCH_TEAM_REQUEST':
            state.isFetching = true;
            return;

        case 'FETCH_TEAM_REQUEST_SUCCESS':
            console.log(action.payload);
            state.isFetching = false;
            if(!_.isEmpty(action.payload)) {
                state.teamName = action.payload.teamName;
                state.quizCode = action.payload.quizCode;
            }
            state.hasFetched = true;
            return;

        case 'FETCH_TEAM_REQUEST_FAILURE':
            state.isFetching = false;
            state.hasFetched = true;
            return;


        case 'SET_ANSWER':
            state.answer = action.payload;
            return;

        default:
            return state;
    }
}, initialState);
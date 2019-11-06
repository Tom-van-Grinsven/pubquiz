import {produce} from "immer";
import {clearError, setError} from "./errorReducer";


export const fetchScore = (quizCode) => {
    return dispatch => {
        dispatch(clearError());
        dispatch(fetchScoreRequest());
        fetch(process.env.REACT_APP_API_URL + '/quizzes/' + quizCode + '/score', {
            method: 'GET',
            credentials: 'include'
        }).then(response => response.json(), err => {
            dispatch(fetchScoreRequestFailure());
            dispatch(setError({
                message: [err]
            }));
        }).then(score => dispatch(fetchScoreRequestSuccess(score)), err => {
            dispatch(fetchScoreRequestFailure(err));
            dispatch(setError({
                message: [err]
            }));
        })
    }
};

const fetchScoreRequest = () => {
    return {
        type: 'FETCH_SCORE_REQUEST'
    }
};

const fetchScoreRequestSuccess = (score) => {
    return {
        type: 'FETCH_SCORE_REQUEST_SUCCESS',
        payload: score
    }
};

const fetchScoreRequestFailure = () => {
    return {
        type: 'FETCH_SCORE_REQUEST_FAILURE'
    }
};

const initialState = {
    isFetching: false,
    isUpdated: true,
    hasFetched: false,
    questionNr: 0,
    roundNr: 0,
    score: []
};

export const leaderboardReducer = produce((state, action) => {

    switch (action.type) {

        case 'UPDATE_QUIZ_ENDED':
        case 'UPDATE_ROUND_POINTS':
        case 'UPDATE_JUDGED_QUESTIONS':
            state.isUpdated = true;
            return;

        case 'FETCH_SCORE_REQUEST':
            state.isFetching = true;
            return;

        case 'FETCH_SCORE_REQUEST_SUCCESS':
            state.isFetching = false;
            state.isUpdated = false;
            state.hasFetched = true;
            state.score = action.payload.score;
            state.roundNr = action.payload.roundNumber;
            state.questionNr = action.payload.questionNumber;
            return;

        case 'FETCH_SCORE_REQUEST_FAILURE':
            state.isFetching = false;
            state.hasFetched = true;
            return;

        default:
            return state;


    }

}, initialState);


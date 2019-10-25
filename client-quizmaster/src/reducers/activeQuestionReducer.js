import {produce} from "immer";


export const fetchActiveQuestion = () => {
    return dispatch => {
        dispatch(fetchActiveQuestionRequest())
        return new Promise((resolve, reject) => {
            resolve({
                id: 1,
                question: 'Who wrote Twilight series of novels?',
                category: 'Art & Literature',
                answer: 'Stephenie Meyer',
                closed: false
            })
        }).then(question => dispatch(fetchActiveQuestionRequestSuccess(question)),
            err => dispatch(fetchActiveQuestionRequestFailure(err)))
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

const fetchActiveQuestionRequestFailure = (err) => {
    return {
        type: 'FETCH_ACTIVE_QUESTION_FAILURE',
        payload: err
    }
};

export const setActiveQuestionIsUpdated = (status) => {
    return {
        type: 'ACTIVE_QUESTION_IS_UPDATED',
        payload: status
    }
};

const initialState = {
    isFetching: false,
    isUpdated: false,
    question: null,
};

export const activeQuestionReducer = produce((state, action) => {

    switch (action.type) {

        case 'ACTIVE_QUESTION_IS_UPDATED':
            state.isUpdated = action.payload;
            return;

        case 'FETCH_ACTIVE_QUESTION':
            state.isFetching = true;
            return;

        case 'FETCH_ACTIVE_QUESTION_SUCCESS':
            state.isFetching = false;
            state.isUpdated = false;
            state.question = action.payload;
            return;

        case 'FETCH_ACTIVE_QUESTION_FAILURE':
            state.isFetching = false;
            state.err = action.payload;
            return;

        default:
            return state

    }

}, initialState);

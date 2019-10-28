import produce from "immer";

export const setQuizName = (quizName) => {
    return {
        type: 'SET_QUIZ_NAME',
        payload: quizName
    }
};

const initialState = {
    name: ''
};

export const quizReducer = produce((state, action) => {

    switch (action.type) {

        case 'SET_QUIZ_NAME':
            state.name = action.payload;
            return;

        default:
            return state
    }
}, initialState);


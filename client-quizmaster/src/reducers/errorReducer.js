import {produce} from "immer";

export const setError = (err) => {
    return {
        type: 'SET_ERROR',
        payload: err
    }
};

export const clearError = () => {
    return {
        type: 'CLEAR_ERROR'
    }
};

export const errorReducer = produce((state, action) => {

    switch (action.type) {
        case 'SET_ERROR':
            state = action.payload;
            return state;

        case 'CLEAR_ERROR':
            state = [];
            return state;

        default:
            return state;
    }

}, []);


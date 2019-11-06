import {produce} from "immer";

export const setError = (component, err) => {
    return {
        type: 'SET_ERROR',
        payload: {
            component,
            err
        }
    }
};

export const clearError = (component) => {
    return {
        type: 'CLEAR_ERROR',
        payload: component
    }
};

export const errorReducer = produce((state, action) => {

    switch (action.type) {
        case 'SET_ERROR':
            let {component, err} = action.payload;
            state = {
                ...state,
                [component]: err
            };
            return state;

        case 'CLEAR_ERROR':

            if(action.payload) {
                if(state[action.payload]) {
                    delete state[action.payload]
                }
            } else {
                state = [];
            }
            return state;

        default:
            return state;
    }

}, {});


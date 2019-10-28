import {produce} from "immer";
import {updateApprovedTeams} from "./approveTeamsReducer";

export const fetchCategories = () => {
    return dispatch => {
        dispatch(fetchCategoriesRequest());
        return new Promise((resolve, reject) => {
            resolve([
                "Art and literature",
                "Music",
                "General Knowledge",
                "Sports",
                "TV & Film",
                "Geography",
                "History",
                "Science & Nature"
            ])
        }).then(categories => dispatch(fetchCategoriesRequestSuccess(categories)),
            err => dispatch(fetchCategoriesRequestFailure(err)))
    }
};

const fetchCategoriesRequest = () => {
    return {
        type: 'FETCH_CATEGORIES_REQUEST'
    }
};

const fetchCategoriesRequestSuccess = (categories) => {
    return {
        type: 'FETCH_CATEGORIES_REQUEST_SUCCESS',
        payload: categories
    }
};

const fetchCategoriesRequestFailure = (err) => {
    return {
        type: 'FETCH_CATEGORIES_REQUEST_FAILURE',
        payload: err
    }
};

export const toggleCategory = (category) => {
    return {
        type: 'TOGGLE_CATEGORY',
        payload: category
    }
};

export const sendCategories = (selectedCategories, history) => {
  return dispatch => {
      return new Promise((resolve, reject) => {
          resolve(selectedCategories);
      }).then(() => {
          history.push('/quiz/dashboard')
      })
  }
};

const initialState = {
    isFetching: false,
    isSending: false,
    categories: [],
    selectedCategories: [],
};

export const createRoundReducer = produce((state, action) => {
    switch (action.type) {

        case 'FETCH_CATEGORIES_REQUEST':
            state.isFetching = true;
            return;

        case 'FETCH_CATEGORIES_REQUEST_SUCCESS':
            state.isFetching = false;
            state.categories = action.payload;
            return;

        case 'FETCH_CATEGORIES_REQUEST_FAILURE':
            state.isFetching = false;
            state.err = action.payload;
            return;

        case 'TOGGLE_CATEGORY':
            if(state.selectedCategories.includes(action.payload)) {
                state.selectedCategories = state.selectedCategories.filter(category => category !== action.payload)
                return;
            }

            if(state.selectedCategories.length === 3) {
                state.selectedCategories = [
                    state.selectedCategories[1],
                    state.selectedCategories[2],
                    action.payload
                ];
            } else {
                state.selectedCategories.push(action.payload)
            }
            return;

        default:
            return state
    }
}, initialState);
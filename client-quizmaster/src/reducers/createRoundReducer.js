import {produce} from "immer";
import {updateApprovedTeams} from "./approveTeamsReducer";
import {clearError, setError} from "./errorReducer";

export const fetchCategories = () => {
    return dispatch => {
        dispatch(fetchCategoriesRequest());
        fetch(process.env.REACT_APP_API_URL + '/categories')
            .then(response => response.json())
            .then(categories => dispatch(fetchCategoriesRequestSuccess(categories)),
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

export const sendRoundCategories = (selectedCategories, quizCode, history) => {
  return dispatch => {

      let err = null;
      if(selectedCategories.length < 3) {
          err = 'Please select 3 categories'
      }

      if(selectedCategories.length > 3) {
          err = 'A round has a maximum of 3 categories'
      }

      if(err) {
          return dispatch(setError({
              messages: [err]
          }))
      }

      dispatch(sendRoundCategoriesRequest());
      fetch(process.env.REACT_APP_API_URL + '/quizzes/' + quizCode + '/categories', {
          method: 'PUT',
          headers: {'Content-Type': 'Application/JSON'},
          credentials: 'include',
          body: JSON.stringify(selectedCategories)
      }).then(() => {
            dispatch(sendRoundCategoriesRequestSuccess());
            dispatch(clearError());
            history.push('/quiz/' + quizCode + '/dashboard')
          },
          err => {
              dispatch(sendRoundCategoriesRequestFailure());
              dispatch(setError({
                  messages: [err.message]
              }))
      })
  }
};

const sendRoundCategoriesRequest = () => {
    return {
        type: 'SEND_ROUND_CATEGORIES_REQUEST'
    }
};

const sendRoundCategoriesRequestSuccess = () => {
    return {
        type: 'SEND_ROUND_CATEGORIES_REQUEST_SUCCESS'
    }
};

const sendRoundCategoriesRequestFailure = () => {
    return {
        type: 'SEND_ROUND_CATEGORIES_FAILURE'
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

        case 'SEND_ROUND_CATEGORIES_REQUEST':
            state.isSending = true;
            return state;

        case 'SEND_ROUND_CATEGORIES_REQUEST_SUCCESS':
        case 'SEND_ROUND_CATEGORIES_REQUEST_FAILURE':
            state.isSending = false;
            return state;

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
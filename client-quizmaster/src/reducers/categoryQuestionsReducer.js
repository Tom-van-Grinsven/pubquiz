import {produce} from "immer";
import {setActiveQuestionIsUpdated} from "./activeQuestionReducer";


export const fetchCategoryQuestions = (quizCode) => {
    return dispatch => {
        dispatch(fetchCategoryQuestionsRequest());
        fetch(process.env.REACT_APP_API_URL + '/quizzes/' + quizCode + '/categories/questions')
            .then(response => response.json())
            .then(categoryQuestions => dispatch(fetchCategoryQuestionsRequestSuccess(categoryQuestions)),
                err => dispatch(fetchCategoryQuestionsRequestFailure(err)))
    }
};

const fetchCategoryQuestionsRequest = () => {
    return {
        type: 'FETCH_CATEGORY_QUESTIONS_REQUEST'
    }
};

const fetchCategoryQuestionsRequestSuccess = (categoryQuestions) => {
    return {
        type: 'FETCH_CATEGORY_QUESTIONS_REQUEST_SUCCESS',
        payload: categoryQuestions
    }
};

const fetchCategoryQuestionsRequestFailure = (err) => {
    return {
        type: 'FETCH_CATEGORY_QUESTIONS_REQUEST_FAILURE',
        payload: err
    }
};

export const toggleSelectedQuestion = (questionId) => {
    return {
        type: 'TOGGLE_SELECTED_QUESTION',
        payload: questionId
    }
};

export const sendActiveQuestion = (questionId) => {
    return dispatch => {
        dispatch(sendActiveQuestionRequest())
        return new Promise((resolve, reject) => resolve(true))
            .then((status) => {
                dispatch(sendActiveQuestionRequestSuccess())
                dispatch(setActiveQuestionIsUpdated(true))
            }, err => dispatch(sendActiveQuestionRequestFailure(err)))
    }
};

const sendActiveQuestionRequest = () => {
    return {
        type: 'SEND_ACTIVE_QUESTION_REQUEST'
    }
};

const sendActiveQuestionRequestSuccess = () => {
    return {
        type: 'SEND_ACTIVE_QUESTION_REQUEST_SUCCESS'
    }
};

const sendActiveQuestionRequestFailure = (err) => {
    return {
        type: 'SEND_ACTIVE_QUESTION_REQUEST_FAILURE',
        payload: err
    }
};


const initialState = {
    isFetching: false,
    isSending: false,
    selectedQuestionId: null,
    list: []
};

export const categoryQuestionsReducer = produce((state, action) => {

   switch (action.type) {

       case 'FETCH_CATEGORY_QUESTIONS_REQUEST':
           state.isFetching = true;
           return;

       case 'FETCH_CATEGORY_QUESTIONS_REQUEST_SUCCESS':
           state.isFetching = false;
           state.list = action.payload;
           return;

       case 'FETCH_CATEGORY_QUESTIONS_REQUEST_FAILURE':
           state.isFetching = false;
           state.err = action.payload;
           return;

       case 'TOGGLE_SELECTED_QUESTION':
           state.selectedQuestionId = action.payload;
           return;

       case 'SEND_ACTIVE_QUESTION_REQUEST':
           state.isSending = true;
           return;

       case 'SEND_ACTIVE_QUESTION_REQUEST_SUCCESS':
           state.isSending = false;
           state.list.forEach((category, index) => {
               state.list[index].questions = category.questions.filter(question => question.id !== state.selectedQuestionId)
           });
           state.selectedQuestionId = null;
           return;

       case 'SEND_ACTIVE_QUESTION_REQUEST_FAILURE':
           state.isSending = false;
           state.err = action.payload;
           return;


       default:
           return state
   }
}, initialState);

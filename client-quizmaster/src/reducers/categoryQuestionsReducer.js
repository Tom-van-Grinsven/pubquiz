import {produce} from "immer";
import {setActiveQuestionIsUpdated} from "./activeQuestionReducer";
import {clearError, setError} from "./errorReducer";


export const fetchCategoryQuestions = (quizCode) => {
    return dispatch => {
        dispatch(clearError());
        dispatch(fetchCategoryQuestionsRequest());
        fetch(process.env.REACT_APP_API_URL + '/quizzes/' + quizCode + '/categories/questions')
            .then(response => response.json(),
                err => {
                    dispatch(setError({
                        message: [err]
                    }));
                })
            .then(categoryQuestions => dispatch(fetchCategoryQuestionsRequestSuccess(categoryQuestions)),
                err => {
                    dispatch(fetchCategoryQuestionsRequestFailure(err));
                    dispatch(setError({
                        message: [err]
                    }));
                })
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

const fetchCategoryQuestionsRequestFailure = () => {
    return {
        type: 'FETCH_CATEGORY_QUESTIONS_REQUEST_FAILURE',
    }
};

export const toggleSelectedQuestion = (questionId) => {
    return {
        type: 'TOGGLE_SELECTED_QUESTION',
        payload: questionId
    }
};

export const sendActiveQuestion = (questionId, quizCode) => {
    return dispatch => {
        dispatch(clearError());
        dispatch(sendActiveQuestionRequest());
        fetch(process.env.REACT_APP_API_URL + '/quizzes/' + quizCode + '/active-questions', {
            method: 'PUT',
            headers: {
                'Content-Type': 'Application/JSON'
            },
            credentials: 'include',
            body: JSON.stringify({
                'id': questionId
            })
        }).then(() => {
            dispatch(sendActiveQuestionRequestSuccess())
            dispatch(setActiveQuestionIsUpdated(true))
        }, err => {
            dispatch(setError({
                message: [err]
            }));
            dispatch(sendActiveQuestionRequestFailure())
        });

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

const sendActiveQuestionRequestFailure = () => {
    return {
        type: 'SEND_ACTIVE_QUESTION_REQUEST_FAILURE',
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

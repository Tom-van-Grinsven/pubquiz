import {produce} from "immer";
import {setActiveQuestionIsUpdated} from "./activeQuestionReducer";
import {clearError, setError} from "./errorReducer";
import {incrementQuestionNr} from "./quizReducer";


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
            dispatch(setActiveQuestionIsUpdated(true));
            dispatch(sendActiveQuestionRequestSuccess());
            dispatch(incrementQuestionNr());
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

export const setCategoryQuestionsUpdated = () => {
    return {
        type: 'CATEGORY_QUESTIONS_UPDATED'
    }
};

const initialState = {
    isFetching: false,
    isSending: false,
    isUpdated: true,
    selectedQuestionId: null,
    activeQuestion: null,
    list: []
};

export const categoryQuestionsReducer = produce((state, action) => {

    let activeQuestion;

    switch (action.type) {

        case 'CATEGORY_QUESTIONS_UPDATED':
            state.isUpdated = true;
            return;

        case 'FETCH_CATEGORY_QUESTIONS_REQUEST':
            state.isFetching = true;
            return;

        case 'FETCH_CATEGORY_QUESTIONS_REQUEST_SUCCESS':
            state.isFetching = false;
            state.isUpdated = false;
            state.list = action.payload;
            state.activeQuestion = state.list.find(question => question.isActive === true);
            return;

        case 'FETCH_CATEGORY_QUESTIONS_REQUEST_FAILURE':
            state.isFetching = false;
            state.isUpdated = false;
            state.err = action.payload;
            return;

        case 'TOGGLE_SELECTED_QUESTION':
            state.selectedQuestionId = action.payload;
            return;

        case 'SEND_ACTIVE_QUESTION_REQUEST':
            state.isSending = true;
            return;

        case 'SEND_ACTIVE_QUESTION_REQUEST_SUCCESS':
            activeQuestion = state.list.find(question => question.isActive === true);
            if (activeQuestion) {
                activeQuestion.isActive = false;
            }

            state.list.find(question => question._id === state.selectedQuestionId).isActive = true;
            state.selectedQuestionId = null;
            state.isSending = false;
            return;

        case 'SEND_ACTIVE_QUESTION_REQUEST_FAILURE':
            state.isSending = false;
            state.err = action.payload;
            return;

        case 'SEND_CLOSE_QUESTION_REQUEST_SUCCESS':
            activeQuestion = state.list.find(question => question.isActive === true);
            activeQuestion.isClosed = true;
            return;

        case 'ACTIVE_QUESTION_VALIDATED':
            activeQuestion = state.list.find(question => question.isActive === true);
            activeQuestion.isValidated = true;
            return;

        default:
            return state
    }
}, initialState);

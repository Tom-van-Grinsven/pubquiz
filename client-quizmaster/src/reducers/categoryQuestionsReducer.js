import {produce} from "immer";
import {setActiveQuestionIsUpdated} from "./activeQuestionReducer";


export const fetchCategoryQuestions = () => {
    return dispatch => {
        dispatch(fetchCategoryQuestionsRequest());
        // test data replace with fetch
        return new Promise((resolve, reject) => {
            resolve([{
                "name": "Art & Literature",
                "questions": [{
                    "id": "1",
                    "question": "Who wrote Twilight series of novels?"
                }, {
                    "id": "2",
                    "question": "Who wrote the poem 'The Owl and the Pussycat'?"
                }, {
                    "id": "3",
                    "question": "In the Adrian Mole Diaries, what is the surname of his girlfriend?"
                }, {
                    "id": "4",
                    "question": "Who wrote the novel Revolutionary Road, which was made into a successful feature film?"
                }]
            }, {
                "name": "General Knowledge",
                "questions": [{
                    "id": "5",
                    "question": "In the wild west, how was Henry McCarty better known?"
                }, {
                    "id": "6",
                    "question": "What famous sauce is manufactured by McIlhenny & Co?"
                }, {
                    "id": "7",
                    "question": "What is the busiest single-runway airport in the world?"
                }, {
                    "id": "8",
                    "question": "On what day of the year is St Georges day held?"
                }]
            }, {
                "name": "Geography",
                "questions": [{
                    "id": "9",
                    "question": "What is the capital of India?"
                }, {
                    "id": "10",
                    "question": "In which city is the European Parliament based?"
                }, {
                    "id": "11",
                    "question": "The highest temperature ever recorded outside in the shade was recorded in Azizah, in Africa. In which country is this city located?"
                }, {
                    "id": "12",
                    "question": "What is the largest fresh water lake in North America?"
                }]
            }, {
                "name": "Music",
                "questions": [{
                    "id": "13",
                    "question": "Which famous group performed the first ever song on Top Of The Pops in 1964?"
                }, {
                    "id": "14",
                    "question": "Which band has released albums titled Word Gets Around, Just Enough Education To Perform and Pull The Pin?"
                }, {
                    "id": "15",
                    "question": "Which supermodel is seen pole dancing in the White Stripes video for the song I Just Don`t Know What To Do With Myself?"
                }, {
                    "id": "16",
                    "question": "Which Beatle led the way across the zebra crossing on the Abbey Road album cover?"
                }]
            }])}).then(categoryQuestions => dispatch(fetchCategoryQuestionsRequestSuccess(categoryQuestions)),
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

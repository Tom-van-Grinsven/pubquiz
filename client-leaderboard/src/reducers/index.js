import * as Redux from 'redux';
import {joinQuizReducer} from "./joinQuizReducer";
import {activeQuestionReducer} from "./activeQuestionReducer";

const mainReducer = Redux.combineReducers({
    joinQuiz: joinQuizReducer,
    activeQuestion: activeQuestionReducer,
});

export default mainReducer

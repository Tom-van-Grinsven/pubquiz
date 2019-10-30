import * as Redux from 'redux';
import {joinQuizReducer} from "./joinQuizReducer";
import {activeQuestionReducer} from './activeQuestionReducer';
import {answerQuestionReducer} from "./answerQuestionReducer";

const mainReducer = Redux.combineReducers({
    joinQuiz: joinQuizReducer,
    activeQuestion: activeQuestionReducer,
    answerQuestion: answerQuestionReducer,
});

export default mainReducer

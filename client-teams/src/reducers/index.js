import * as Redux from 'redux';
import {joinQuizReducer} from "./joinQuizReducer";
import {activeQuestionReducer} from './activeQuestionReducer';
import {answerQuestionReducer} from "./answerQuestionReducer";
import {webSocketReducer} from './webSocketReducer'
import {errorReducer} from "./errorReducer";

const mainReducer = Redux.combineReducers({
    joinQuiz: joinQuizReducer,
    err: errorReducer,
    activeQuestion: activeQuestionReducer,
    answerQuestion: answerQuestionReducer,
    webSocket: webSocketReducer,
});

export default mainReducer

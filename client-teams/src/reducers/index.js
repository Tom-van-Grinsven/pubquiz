import * as Redux from 'redux';
import {joinQuizReducer} from "./joinQuizReducer";
import {activeQuestionReducer} from './activeQuestionReducer';
import {answerQuestionReducer} from "./answerQuestionReducer";
import {webSocketReducer} from './webSocketReducer'
import {errorReducer} from "./errorReducer";
import {quizReducer} from "./quizReducer";
import {teamReducer} from "./teamReducer";

const mainReducer = Redux.combineReducers({
    quiz: quizReducer,
    joinQuiz: joinQuizReducer,
    team: teamReducer,
    err: errorReducer,
    activeQuestion: activeQuestionReducer,
    answerQuestion: answerQuestionReducer,
    webSocket: webSocketReducer,
});

export default mainReducer

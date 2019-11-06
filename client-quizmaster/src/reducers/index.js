import * as Redux from 'redux';
import {registerReducer} from "./registerReducer";
import {loginReducer} from "./loginReducer";
import {quizReducer} from "./quizReducer";
import {approveTeamsReducer} from "./approveTeamsReducer";
import {createRoundReducer} from "./createRoundReducer";
import {categoryQuestionsReducer} from "./categoryQuestionsReducer";
import {teamAnswersReducer} from "./teamAnswersReducer";
import {activeQuestionReducer} from "./activeQuestionReducer";
import {errorReducer} from "./errorReducer";
import {webSocketReducer} from "./webSocketReducer";
import {accountReducer} from "./accountReducer";
import {routerReducer} from "react-router-redux";

const mainReducer = Redux.combineReducers({
    routing: routerReducer,
    websocket: webSocketReducer,
    err: errorReducer,
    loginRegister: Redux.combineReducers({
        login: loginReducer,
        register: registerReducer,
    }),
    account: accountReducer,
    quiz: quizReducer,
    approveTeams: approveTeamsReducer,
    createRound: createRoundReducer,
    dashboard: Redux.combineReducers({
        categoryQuestions: categoryQuestionsReducer,
        teamAnswers: teamAnswersReducer,
        activeQuestion: activeQuestionReducer
    })
});

export default mainReducer

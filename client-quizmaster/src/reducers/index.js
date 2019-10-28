import * as Redux from 'redux';
import {registerReducer} from "./registerReducer";
import {loginReducer} from "./loginReducer";
import {quizReducer} from "./quizReducer";
import {approveTeamsReducer} from "./approveTeamsReducer";
import {createRoundReducer} from "./createRoundReducer";
import {categoryQuestionsReducer} from "./categoryQuestionsReducer";
import {teamAnswersReducer} from "./teamAnswersReducer";
import {activeQuestionReducer} from "./activeQuestionReducer";

const mainReducer = Redux.combineReducers({
    loginRegister: Redux.combineReducers({
        login: loginReducer,
        register: registerReducer,

    }),
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

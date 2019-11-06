import * as Redux from 'redux';
import {joinQuizReducer} from "./joinQuizReducer";
import {activeQuestionReducer} from "./activeQuestionReducer";
import {quizReducer} from "./quizReducer";
import {leaderboardReducer} from "./leaderboardReducer";
import {webSocketReducer} from "./webSocketReducer";
import {teamAnswersReducer} from "./teamAnswersReducer";

const mainReducer = Redux.combineReducers({
    quiz: quizReducer,
    joinQuiz: joinQuizReducer,
    activeQuestion: activeQuestionReducer,
    leaderboard: leaderboardReducer,
    websocket: webSocketReducer,
    teamAnswers: teamAnswersReducer
});

export default mainReducer

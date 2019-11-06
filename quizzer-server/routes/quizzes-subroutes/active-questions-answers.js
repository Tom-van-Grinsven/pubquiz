'use strict';

const authorizationService  = require('../../service/authorization-service');
const websocketService      = require('../../service/websocket-services');
const express               = require('express');

require('../../models/question.js');
require('../../models/quiz.js');

const quizActiveQuestionAnswerRouter = express.Router();

quizActiveQuestionAnswerRouter.get('/', async function(req, res) {
    try {

        const currentQuestion = req.quiz.questions.find(question => question.isActive === true);
        // if(!authorizationService.isAuthorized(req) && currentQuestion.isClosed === false) {
        //     return res.sendStatus(403);
        // }

        let result = await req.quiz.getGivenAnswers();
        return res.send(result);


    } catch (err) {
        console.log(err);
        res.sendStatus(500)
    }
});

quizActiveQuestionAnswerRouter.put('/', async function(req, res) {
    try {
        if(req.session.account){

            if(!authorizationService.isAuthorized(req)) {
                return res.sendStatus(403);
            }

            await req.quiz.judgeGivenAnswers(req.body);

            websocketService.sendMessageToWebsocketTeams(req, "UPDATE_JUDGED_QUESTIONS");
            websocketService.sendMessageToWebsocketScoreboard(req,"UPDATE_JUDGED_QUESTIONS");

            res.sendStatus(204);
        }
        else {
            if(req.body.answer){
                await req.quiz.setTeamAnswerForQuestion(req.body.teamName, req.body.answer);
                websocketService.sendMessageToWebsocketQuizmaster(req, "UPDATE_GIVEN_TEAM_ANSWERS");
                websocketService.sendMessageToWebsocketScoreboard(req,"UPDATE_GIVEN_TEAM_ANSWERS");
                res.send(204)
            } else {
                res.sendStatus(400)
            }
        }
    } catch (err) {
        console.log(err);
        res.sendStatus(500)
    }
});

module.exports = quizActiveQuestionAnswerRouter;
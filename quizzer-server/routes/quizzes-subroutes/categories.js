'use strict';

const authorizationService = require('../../service/authorization-service');
const websocketService = require('../../service/websocket-services');

const express   = require('express');

const quizCategoryRouter = express.Router();

quizCategoryRouter.put('/', async function(req, res) {
    try{
        if(!authorizationService.isAuthorized(req)) {
            return res.sendStatus(403);
        }

        await req.quiz.setRoundQuestionsByCategories(req.body);
        await req.quiz.updateTeamPoints();

        websocketService.sendMessageToWebsocketScoreboard(req, "UPDATE_ACTIVE_QUESTION");
        websocketService.sendMessageToWebsocketScoreboard(req, "UPDATE_ROUND_POINTS");

        res.sendStatus(204)
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

module.exports = quizCategoryRouter;
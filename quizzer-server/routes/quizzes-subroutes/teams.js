'use strict';

const authorizationService = require('../../service/authorization-service');
const websocketService = require('../../service/websocket-services');

const express   = require('express');

const quizTeamRouter = express.Router();

quizTeamRouter.get('/', async function(req, res) {
    try {

        if(!authorizationService.isAuthorized(req)) {
            return res.sendStatus(403);
        }

        let result = await req.quiz.getJoinedTeamsOfQuiz();
        res.status(200).send(result);
    } catch (err) {
        console.log(err);
        res.sendStatus(500)
    }
});

quizTeamRouter.post('/', async function(req, res) {
    try{
        if(req.body.teamName && req.quiz.isOpen){
            req.session.team = await req.quiz.addJoinedTeamToQuiz(req.body);
            if(req.session.team){
                req.session.quizCode = req.quiz.code;
                websocketService.sendMessageToWebsocketQuizmaster(req, "UPDATE_JOINED_TEAMS");
                res.sendStatus(201);
            } else {
                res.sendStatus(400);
            }
        } else {
            res.sendStatus(403)
        }
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

quizTeamRouter.put('/', async function(req, res) {
    try{

        await req.quiz.setDefinitiveTeamsForQuiz(req.body);
        websocketService.filterWebsocketConnectionsForDefinitiveTeam(req, req.body);
        websocketService.sendMessageToWebsocketTeams(req, "UPDATE_DEFINITIVE_TEAMS");
        websocketService.sendMessageToWebsocketScoreboard(req, "UPDATE_DEFINITIVE_TEAMS");
        res.sendStatus(204)

    } catch (err) {
        console.log(err);
        res.sendStatus(500)
    }
});

module.exports = quizTeamRouter;
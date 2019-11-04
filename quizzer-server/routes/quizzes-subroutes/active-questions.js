'use strict';

const express           = require('express');
const websocketService  = require('../../service/websocket-services');

const quizActiveQuestionRouter = express.Router();

quizActiveQuestionRouter.get('/', async function(req, res) {
    try{
        if(req.session.account){
            let result = await req.quiz.getActiveQuestion();
            res.send(result);
        } else if (req.session.team || req.session.quizCode){
            let result = await req.quiz.getActiveQuestion();
            if(result._id) {
                let questionObject = {
                    roundNr: req.quiz.roundNumber,
                    questionNr: req.quiz.questionNumber,
                    question: result.question,
                    category: result.category,
                    isClosed: result.isClosed,
                    isValidated: result.isValidated,
                    _id: result._id,
                };
                if(result.isClosed) {
                    questionObject['answer'] = result.answer
                }
                return res.send(questionObject);
            } else {
                res.send({});
            }

        }
    } catch (err) {
        console.log(err);
        res.json("nope");
    }
});

quizActiveQuestionRouter.put('/', async function(req, res) {
    try{
        if(req.body.id){
            await req.quiz.setActiveQuestion(req.body.id);
            websocketService.sendMessageToWebsocketTeams(req, "UPDATE_ACTIVE_QUESTION");
            websocketService.sendMessageToWebsocketScoreboard(req, "UPDATE_ACTIVE_QUESTION");
            res.json("Ok");
        } else if (req.body.closed){
            await req.quiz.setClosedQuestion(req.body.closed);
            websocketService.sendMessageToWebsocketTeams(req, "UPDATE_CLOSED_QUESTION");
            websocketService.sendMessageToWebsocketScoreboard(req, "UPDATE_CLOSED_ACTION");
            res.json("ok");
        }
    } catch (err) {
        console.log(err);
        res.json("nope");
    }
});

module.exports = quizActiveQuestionRouter;
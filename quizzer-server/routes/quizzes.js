'use strict';

const express   = require('express');
const mongoose  = require('mongoose');

const authorizationService = require('../service/authorization-service');
const websocketService = require('../service/websocket-services');

const quizActiveQuestionRouter          = require('./quizzes-subroutes/active-questions');
const quizActiveQuestionAnswerRouter    = require('./quizzes-subroutes/active-questions-answers');
const quizCategoryRouter                = require('./quizzes-subroutes/categories');
const quizCategoryQuestionRouter        = require('./quizzes-subroutes/categories-questions');
const quizScoreRouter                   = require('./quizzes-subroutes/score');
const quizTeamRouter                    = require('./quizzes-subroutes/teams');

require('../models/question.js');
require('../models/quiz.js');

const quizRouter = express.Router();

const Quiz = mongoose.model('Quiz');

quizRouter.use('/:quizcode', async (req, res, next) => {
    try {
        req.quiz = await Quiz.findOne({code: req.params.quizcode});
        if(req.quiz){
            req.session.quizCode = req.quiz.code;
        } else if (!req.quiz){
            return res.sendStatus(404)
        }
        next();
    } catch(err) {
        next(err);
    }
});

quizRouter.use('/:quizcode/active-questions', quizActiveQuestionRouter);
quizRouter.use('/:quizcode/active-questions/answers', quizActiveQuestionAnswerRouter);
quizRouter.use('/:quizcode/categories', quizCategoryRouter);
quizRouter.use('/:quizcode/categories/questions', quizCategoryQuestionRouter);
quizRouter.use('/:quizcode/score', quizScoreRouter);
quizRouter.use('/:quizcode/teams', quizTeamRouter);

quizRouter.get('/:quizcode', async function(req, res){
    try {
        const { isActive, isOpen, roundNumber, questionNumber, _id, code, name } = req.quiz;
        res.send({_id, code, isActive, isOpen, roundNumber, questionNumber, name});
    } catch (err) {
        console.log(err);
        res.sendStatus(500)
    }
});

quizRouter.post('/', async function(req, res){
    try {
        if(!authorizationService.isAuthorized(req, false)) {
            return res.sendStatus(403);
        }

        let quiz = await Quiz.createNewQuiz(req.body.quizName, req.session.account._id);
        req.session.quizCode = quiz.code;
        return res.status(201).send({quizCode: quiz.code});

    } catch (err) {
        console.log(err);
        res.sendStatus(500)
    }
});

quizRouter.put('/:quizcode', async function(req, res){
    try {
        if(!authorizationService.isAuthorized(req)) {
            return res.sendStatus(403);
        }

        const isActive = req.body.isActive;
        if(isActive === true || isActive === false) {
            req.quiz.isActive = isActive;
            await req.quiz.save();

            if(!isActive) {
                await req.quiz.updateTeamPoints();

                websocketService.sendMessageToWebsocketScoreboard(req, "UPDATE_QUIZ_ENDED");
                websocketService.sendMessageToWebsocketTeams(req, "UPDATE_QUIZ_ENDED")

            }
            res.sendStatus(204);
        }

    } catch (err) {
        console.log(err);
        res.sendStatus(500)
    }
});

module.exports = quizRouter;
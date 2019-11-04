'use strict';

const express   = require('express');

const authorizationService = require('../../service/authorization-service');

const quizCategoryQuestionRouter = express.Router();

quizCategoryQuestionRouter.get('/', async function(req, res) {
    try {
        if(!authorizationService.isAuthorized(req)) {
            return res.sendStatus(403);
        }

        let result = await req.quiz.getQuestionsForRound();
        res.send(result);

    } catch (err) {
        console.log(err);
        res.sendStatus(500)
    }
});

module.exports = quizCategoryQuestionRouter;
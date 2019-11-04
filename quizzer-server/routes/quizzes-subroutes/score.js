'use strict';

const express   = require('express');

const quizScoreRouter = express.Router();

quizScoreRouter.get('/', function(req, res){
    try {
        return res.status(200).send(req.quiz.getScore());
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
});

module.exports = quizScoreRouter;
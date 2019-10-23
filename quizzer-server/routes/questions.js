'use strict';

const express   = require('express');
const mongoose  = require('mongoose');

require('../models/question.js');

const questionRouter = express.Router();

const Question  = mongoose.model('Question');

questionRouter.get('/questions', async function(req,res, next){
    try {
        let categories = ["Sport", "Film and Tv", "History"];
        let questions = await Question.getQuestionsForRound(categories);
        res.json(questions)
    } catch (err) {
        console.log(err);
    }
});

module.exports = questionRouter;

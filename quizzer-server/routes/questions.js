'use strict';

const express   = require('express');
const path      = require('path');
const mongoose  = require('mongoose');

require('../models/question.js');

const questionRouter = express.Router();

const Question  = mongoose.model('Question');

questionRouter.get('/questions', async function(req,res, next){
    try {
        let categories = ["Art and Literature", "Music", "History"];
        let questions = await Question.getQuestionsForRound(categories);
        console.log(questions);
        res.json("GET /questions")
    } catch (err) {
        console.log(err);
    }
});

module.exports = questionRouter;

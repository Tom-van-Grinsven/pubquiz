'use strict';

const express   = require('express');
const mongoose  = require('mongoose');

require('../models/question.js');
require('../models/quiz.js')

const questionRouter = express.Router();

const Question  = mongoose.model('Question');
const Quiz = mongoose.model('Quiz');

// questionRouter.get('/questions', async function(req,res, next){
//     try {
//         let categories = ["Sport", "Film and Tv", "History"];
//         let questions = await Question.getQuestionsForRound(categories);
//         res.json(questions)
//     } catch (err) {
//         console.log(err);
//     }
// });

questionRouter.put('/setquestions', async function(req, res, next) {
    try{
        let categories = ["Sport", "Film and Tv", "History"];
        let result = await req.quiz.setRoundQuestionsByCategories(categories);
        res.ok();
    } catch (err) {
        console.log(err);
        res.json("nope");
    }
});

module.exports = questionRouter;

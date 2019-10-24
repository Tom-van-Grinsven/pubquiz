'use strict';

const express   = require('express');
const mongoose  = require('mongoose');

const questionRouter    = require('./questions');

require('../models/question.js');
require('../models/quiz.js')

const quizRouter = express.Router();

const Question  = mongoose.model('Question');
const Quiz = mongoose.model('Quiz');

quizRouter.use('/:quizcode', async (req, res, next) => {

    req.quiz = await Quiz.findOne({code: req.params.quizcode});
    next();
});

// quizRouter.put('/:quizcode/setquestions', async function(req, res, next) {
//     try{
//         let categories = ["Art and Literature", "Film and Tv", "History"];
//         let result = await req.quiz.setRoundQuestionsByCategories(categories);
//         res.send("ok");
//     } catch (err) {
//         console.log(err);
//         res.json("nope");
//     }
// });


quizRouter.get('/:quizcode/teams', async function(req, res, next) {
    try {
        let result = await req.quiz.getJoinedTeamsOfQuiz()
        res.json(result);
    } catch (err) {
        console.log(err)
    }
});

quizRouter.post('/:quizcode/teams', async function(req, res, next) {
    try{
        if(req.body.teamName){
            let result = await req.quiz.addJoinedTeamToQuiz(req.body);
            res.send("ok");
        } else {
            res.send("Niet oke")
        }
    } catch (err) {
        console.log(err);
        res.json("nope");
    }
});


quizRouter.put('/:quizcode/teams', async function(req, res, next) {
    try{
        await req.quiz.setDefinitiveTeamsForQuiz(req.body);
        res.send("ok");
    } catch (err) {
        console.log(err);
        res.json("nope");
    }
});

quizRouter.put('/:quizcode/active-question', async function(req, res, next) {
    try{
        await req.quiz.setClosedQuestion(req.body.questionId);
        res.send("ok");
    } catch (err) {
        console.log(err);
        res.json("nope");
    }
});

quizRouter.use('/:quizcode/activequestion', questionRouter);

module.exports = quizRouter;



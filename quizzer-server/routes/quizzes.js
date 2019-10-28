'use strict';

const express   = require('express');
const mongoose  = require('mongoose');

require('../models/question.js');
require('../models/quiz.js');

const quizRouter = express.Router();

const Question  = mongoose.model('Question');
const Quiz = mongoose.model('Quiz');

quizRouter.use('/:quizcode', async (req, res, next) => {
    req.quiz = await Quiz.findOne({code: req.params.quizcode});
    next();
});

quizRouter.post('/', async function(req, res, next){
    try {
        let quiz = await Quiz.createNewQuiz(req.body.quizName);
        res.json(quiz.code);
    } catch (err) {
        console.log(err);
        res.json(err);
    }
});

quizRouter.get('/:quizcode', async function(req, res, next){
   try {
       res.json(req.quiz);
   } catch (err) {
       res.json(err);
   }
});

quizRouter.put('/:quizcode/categories', async function(req, res, next) {
    try{
        await req.quiz.setRoundQuestionsByCategories(req.body);
        res.send("ok");
    } catch (err) {
        console.log(err);
        res.json("nope");
    }
});

quizRouter.get('/:quizcode/categories/questions', async function(req, res, next) {
    try {
        let result = await req.quiz.getQuestionsForRound();
        res.json(result);
    } catch (err) {
        console.log(err);
    }
});

quizRouter.get('/:quizcode/teams', async function(req, res, next) {
    try {
        let result = await req.quiz.getJoinedTeamsOfQuiz()
        res.json(result);
    } catch (err) {
        console.log(err)
        res.json(err.message);
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
        res.json(err.message);
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

quizRouter.put('/:quizcode/active-questions', async function(req, res, next) {
    try{
        if(req.body.id){
            await req.quiz.setActiveQuestion(req.body.id);
            res.json("Ok");
        } else if (req.body.closed){
            await req.quiz.setClosedQuestion(req.body.closed);
            res.json("ok");
        }
    } catch (err) {
        console.log(err);
        res.json("nope");
    }
});

quizRouter.get('/:quizcode/active-questions', async function(req, res, next) {
    try{
        let result = await req.quiz.getActiveQuestion();
        res.json(result);
    } catch (err) {
        console.log(err);
        res.json("nope");
    }
});

quizRouter.get('/:quizcode/active-questions/answers', async function(req, res, next) {
    try {
        let result = await req.quiz.getGivenAnswers();
        res.json(result);
    } catch (err) {
        console.log(err);
    }
});

// TODO: implementeer onderscheid tussen quizmaster/team
// quizRouter.put('/:quizcode/active-questions/answers', async function(req, res, next) {
//    try {
//        await req.quiz.setTeamAnswerForQuestion(req.body.team, req.body.answer);
//        res.json("Ok");
//    } catch (err) {
//        console.log(err);
//    }
// });

quizRouter.put('/:quizcode/active-questions/answers', async function(req, res, next) {
   try {
        await req.quiz.judgeGivenAnswers(req.body);
        res.json("Ok");
   } catch (err) {
       console.log(err);
   }
});

module.exports = quizRouter;



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
    req.session.quizCode = req.quiz.code;
    next();
});

quizRouter.post('/', async function(req, res, next){
    try {
        let quiz = await Quiz.createNewQuiz(req.body.quizName);
        req.session.quizCode = quiz.code;
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
        let result = await req.quiz.getJoinedTeamsOfQuiz();
        res.json(result);
    } catch (err) {
        console.log(err);
        res.json(err.message);
    }
});

quizRouter.post('/:quizcode/teams', async function(req, res, next) {
    try{
        if(req.body.teamName){

            req.session.team = await req.quiz.addJoinedTeamToQuiz(req.body);
            req.session.quizCode = req.quiz.code;

            await sendMessageToWebsocketQuizmaster(req, "UPDATE_JOINED_TEAMS");

            res.send("ok");
        } else {
            res.send("Niet oke")
        }
    } catch (err) {
        console.log(err);
        res.json(err.message);
    }
});


quizRouter.put('/:quizcode/teams', async function(req, res, next) {
    try{
        await req.quiz.setDefinitiveTeamsForQuiz(req.body);

        filterWebsocketConnectionsForDefinitiveTeam(req, req.body);

        sendMessageToWebsocketTeams(req, "UPDATE_DEFINITIVE_TEAMS");
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
            sendMessageToWebsocketTeams(req, "UPDATE_ACTIVE_QUESTION");
            res.json("Ok");
        } else if (req.body.closed){
            await req.quiz.setClosedQuestion(req.body.closed);
            sendMessageToWebsocketTeams(req, "UPDATE_CLOSED_QUESTION");
            res.json("ok");
        }
    } catch (err) {
        console.log(err);
        res.json("nope");
    }
});

quizRouter.get('/:quizcode/active-questions', async function(req, res, next) {
    try{
        if(req.session.account){
            let result = await req.quiz.getActiveQuestion();
            console.log('result', result);
            res.json(result);
        } else if (req.session.team){
                let result = await req.quiz.getActiveQuestion();
                let questionObjectForTeams = {
                    question: result.question,
                    category: result.category,
                    _id: result._id,
                };
                res.json(questionObjectForTeams);
        }
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

quizRouter.put('/:quizcode/active-questions/answers', async function(req, res, next) {
   try {
       if(req.session.account){
           console.log(req.session.account);
           await req.quiz.judgeGivenAnswers(req.body);
           sendMessageToWebsocketTeams(req, "UPDATE_JUDGED_QUESTIONS");
           sendMessageToWebsocketScoreboard("UPDATE_JUDGED_QUESTIONS");
           res.json("Ok");
       }
       else {
           console.log('hiero');
           await req.quiz.setTeamAnswerForQuestion(req.body.teamName, req.body.answer);
           sendMessageToWebsocketQuizmaster(req, "UPDATE_GIVEN_TEAM_ANSWERS");
           res.json("Ok");
       }
   } catch (err) {
       console.log(err);
   }
});

function sendMessageToWebsocketTeams(req, message) {
    req.websocketServer.clients.forEach((client) => {
        console.log(client.session);
        if(!client.session.account && req.quiz.code === client.session.quizCode){
            client.send(JSON.stringify({type: message}));
        }
    })
}

function sendMessageToWebsocketQuizmaster(req, message){
    req.websocketServer.clients.forEach((client) => {
        if(!client.session.team && req.quiz.code === client.session.quizCode){
            client.send(JSON.stringify({type: message}));
        }
    })
}

function sendMessageToWebsocketScoreboard(req, message){
    req.websocketServer.clients.forEach((client) => {
        // TODO: hoeveel scoreborden willen we eigenlijk maximaal toestaan?
        if(!client.session.team && !client.session.account){
            if(!req.quiz.code === client.session.quizCode){
                client.send(JSON.stringify({type: message}));
            }
        }
    })
}

function filterWebsocketConnectionsForDefinitiveTeam(req, teams){
    req.websocketServer.clients.forEach((el) => {
        if(el.session.team && el.session.quizCode === req.quiz.code){
            console.log(el.session.team);
            if(!teams.includes(el.session.team.teamName)){
                el.close();
            }
        }
    });
}

module.exports = quizRouter;
'use strict';

const express   = require('express');
const mongoose  = require('mongoose');

require('../models/question.js');
require('../models/quiz.js');

const quizRouter = express.Router();

const Quiz = mongoose.model('Quiz');

const isAuthorized = (req, checkQuizOwner = true) => {

    // for testing
    // return true;

    // if(req.session.account === undefined || req.session.account._id === undefined) {
    //     return false;
    // }
    //
    // if(checkQuizOwner && req.quiz !== undefined) {
    //     return String(req.quiz.quizOwner) === req.session.account._id
    // }

    return true;

};

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
        if(!isAuthorized(req, false)) {
            return res.sendStatus(403);
        }

        let quiz = await Quiz.createNewQuiz(req.body.quizName, req.session.account._id);
        req.session.quizCode = quiz.code;
        return res.status(201).json(quiz.code);

    } catch (err) {
        console.log(err);
        res.sendStatus(500)
    }
});

quizRouter.put('/:quizcode', async function(req, res){
    try {
        if(!isAuthorized(req)) {
            return res.sendStatus(403);
        }

        const isActive = req.body.isActive;
        if(isActive === true || isActive === false) {
            req.quiz.isActive = isActive;
            await req.quiz.save();

            if(!isActive) {
                await req.quiz.updateTeamPoints();
                // TODO: Send websocket message to leaderboard
                sendMessageToWebsocketScoreboard(req, "UPDATE_QUIZ_ENDED");
                sendMessageToWebsocketTeams(req, "UPDATE_QUIZ_ENDED")

            }
            res.sendStatus(204);
        }

    } catch (err) {
        console.log(err);
        res.sendStatus(500)
    }
});



quizRouter.get('/:quizcode/score', function(req, res){
    try {
        return res.json(req.quiz.getScore());
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
});

quizRouter.put('/:quizcode/categories', async function(req, res) {
    try{
        if(!isAuthorized(req)) {
            return res.sendStatus(403);
        }

        await req.quiz.setRoundQuestionsByCategories(req.body);
        await req.quiz.updateTeamPoints();

        sendMessageToWebsocketScoreboard(req, "UPDATE_ACTIVE_QUESTION");
        sendMessageToWebsocketScoreboard(req, "UPDATE_ROUND_POINTS");

        res.sendStatus(204)
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

quizRouter.get('/:quizcode/categories/questions', async function(req, res) {
    try {
        if(!isAuthorized(req)) {
            return res.sendStatus(403);
        }

        let result = await req.quiz.getQuestionsForRound();
        res.send(result);

    } catch (err) {
        console.log(err);
        res.sendStatus(500)
    }
});

quizRouter.get('/:quizcode/teams', async function(req, res) {
    try {

        if(!isAuthorized(req)) {
            return res.sendStatus(403);
        }

        let result = await req.quiz.getJoinedTeamsOfQuiz();
        res.send(result);
    } catch (err) {
        console.log(err);
        res.sendStatus(500)
    }
});

quizRouter.post('/:quizcode/teams', async function(req, res) {
    try{
        if(req.body.teamName && req.quiz.isOpen){
            console.log(' ja hier ');
            req.session.team = await req.quiz.addJoinedTeamToQuiz(req.body);
            if(req.session.team){
                req.session.quizCode = req.quiz.code;
                sendMessageToWebsocketQuizmaster(req, "UPDATE_JOINED_TEAMS");
                res.sendStatus(201);
            } else {
                res.sendStatus(400);
            }
        } else {
            res.sendStatus(403)
        }
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});


quizRouter.put('/:quizcode/teams', async function(req, res) {
    try{

        await req.quiz.setDefinitiveTeamsForQuiz(req.body);
        filterWebsocketConnectionsForDefinitiveTeam(req, req.body);
        sendMessageToWebsocketTeams(req, "UPDATE_DEFINITIVE_TEAMS");
        sendMessageToWebsocketScoreboard(req, "UPDATE_DEFINITIVE_TEAMS");
        res.sendStatus(204)

    } catch (err) {
        console.log(err);
        res.sendStatus(500)
    }
});

quizRouter.put('/:quizcode/active-questions', async function(req, res) {
    try{
        if(req.body.id){
            await req.quiz.setActiveQuestion(req.body.id);
            sendMessageToWebsocketTeams(req, "UPDATE_ACTIVE_QUESTION");
            sendMessageToWebsocketScoreboard(req, "UPDATE_ACTIVE_QUESTION");
            res.json("Ok");
        } else if (req.body.closed){
            await req.quiz.setClosedQuestion(req.body.closed);
            sendMessageToWebsocketTeams(req, "UPDATE_CLOSED_QUESTION");
            sendMessageToWebsocketScoreboard(req, "UPDATE_CLOSED_ACTION");
            res.json("ok");
        }
    } catch (err) {
        console.log(err);
        res.json("nope");
    }
});

quizRouter.get('/:quizcode/active-questions', async function(req, res) {
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

quizRouter.get('/:quizcode/active-questions/answers', async function(req, res) {
    try {

        const currentQuestion = req.quiz.questions.find(question => question.isActive === true);
        if(!isAuthorized(req) && currentQuestion.isClosed === false) {
            return res.sendStatus(403);
        }

        let result = await req.quiz.getGivenAnswers();
        res.send(result);

    } catch (err) {
        console.log(err);
        res.sendStatus(500)
    }
});

quizRouter.put('/:quizcode/active-questions/answers', async function(req, res) {
   try {
       if(req.session.account){

           if(!isAuthorized(req)) {
               return res.sendStatus(403);
           }

           await req.quiz.judgeGivenAnswers(req.body);
           sendMessageToWebsocketTeams(req, "UPDATE_JUDGED_QUESTIONS");

           // TODO: Send websocket message to leaderboard
           sendMessageToWebsocketScoreboard(req,"UPDATE_JUDGED_QUESTIONS");
           res.sendStatus(204);
       }
       else {
           if(req.body.answer){
               await req.quiz.setTeamAnswerForQuestion(req.body.teamName, req.body.answer);
               sendMessageToWebsocketQuizmaster(req, "UPDATE_GIVEN_TEAM_ANSWERS");
               res.send(204)
           } else {
               res.sendStatus(400)
           }
       }
   } catch (err) {
       console.log(err);
       res.sendStatus(500)
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
        if(client.session.account && req.quiz.code === client.session.quizCode){
            client.send(JSON.stringify({type: message}));
        }
    })
}

function sendMessageToWebsocketScoreboard(req, message){
    req.websocketServer.clients.forEach((client) => {
        if(!client.session.team && !client.session.account){
            client.send(JSON.stringify({type: message}));
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
'use strict';

const express           = require('express');

const quizActiveQuestionRouter = express.Router();

quizActiveQuestionRouter.get('/', async function(req, res) {
    try{
        if(req.session.account){
            let result = await req.quiz.getActiveQuestion();
            res.send(result);
        } else if (req.session.team || req.session.quizCode){
            let result = await req.quiz.getActiveQuestion();
            if(result._id) {
                console.log(result);
                let questionObject = {
                    roundNr: req.quiz.roundNumber,
                    questionNr: req.quiz.questionNumber,
                    question: result.question,
                    category: result.category,
                    isClosed: result.isClosed,
                    isValidated: result.isValidated,
                    timer: result.timer,
                    timestamp: result.timestamp,
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
        res.sendStatus(500)
    }
});

quizActiveQuestionRouter.put('/', async function(req, res) {
    try{
        if(req.body.id){

            await req.quiz.setActiveQuestion(req);
            res.sendStatus(204)

        } else if (req.body.closed){
            await req.quiz.closeActiveQuestion(req);
            res.sendStatus(204)
        }
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

module.exports = quizActiveQuestionRouter;
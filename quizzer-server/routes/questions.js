const express   = require('express');
const path      = require('path');

const questionRouter = express.Router();

questionRouter.get('/questions', async function(req,res, next){
    try {
        // TODO: voorbeeld GET endpoint
        res.json("GET /questions")
    } catch (err) {
        console.log(err);
    }
});

module.exports = questionRouter;

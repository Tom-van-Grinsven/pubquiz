'use strict';

const express   = require('express');
const mongoose  = require('mongoose');

require('../models/question.js');


const categoryRouter = express.Router();

const Question  = mongoose.model('Question');


categoryRouter.get('/', async function(req, res, next) {
    try {
        let categories = await Question.getCategories();
        res.json(categories)
    } catch (err) {
        console.log(err);
    }
});

module.exports = categoryRouter;
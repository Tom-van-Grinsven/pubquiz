'use strict';

const express   = require('express');
const mongoose  = require('mongoose');

require('../models/account.js');

const sessionRouter = express.Router();

const Account  = mongoose.model('Account');

sessionRouter.post('/', async function(req, res, next) {
    try {
        req.session.account = await Account.loginAccount(req.body.email, req.body.password);
        res.sendStatus(200);
    } catch (err) {
        console.log(err.message);
        res.sendStatus(401);
    }
});

sessionRouter.get('/', async function(req, res, next) {
    try {

        if(req.session.account) {
            res.send({
                isLoggedIn: true,
                _id: req.session.account._id,
                email: req.session.account.email
            })
        } else if(req.session.team) {
            res.send({
                teamName: req.session.team.teamName,
                quizCode: req.session.quizCode,
            })
        }
        else {
            res.send({
                isLoggedIn: false,
            })
        }

    } catch (err){
        console.log(err.message);
        res.sendStatus(500);
    }
});

module.exports = sessionRouter;
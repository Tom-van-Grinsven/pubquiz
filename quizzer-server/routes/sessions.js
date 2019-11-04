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
        res.sendStatus(401);
    }
});

sessionRouter.get('/', async function(req, res, next) {
    try {

        if(req.session.account) {
            res.status(200).send({
                isLoggedIn: true,
                _id: req.session.account._id,
                email: req.session.account.email
            })
        } else if(req.session.team) {
            res.status(200).send({
                teamName: req.session.team.teamName,
                quizCode: req.session.quizCode,
            })
        }
        else {
            res.status(200).send({
                isLoggedIn: false,
            })
        }

    } catch (err){
        console.log(err);
        return next(err);
    }
});

module.exports = sessionRouter;
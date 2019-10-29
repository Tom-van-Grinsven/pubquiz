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
        res.json(req.session.account);
    } catch (err){
        console.log(err.message);
        res.sendStatus(401);
    }
});

module.exports = sessionRouter;
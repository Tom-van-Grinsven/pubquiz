'use strict';

const express   = require('express');
const mongoose  = require('mongoose');

require('../models/account.js');

const accountRouter = express.Router();
const Account  = mongoose.model('Account');

accountRouter.post('/', async function(req, res, next) {
    try {
        req.session.account = await Account.registerAccount(req.body.email, req.body.password);
        res.sendStatus(201)
    } catch (err) {
        res.status(400).send({err: err.message});
    }
});

module.exports = accountRouter;
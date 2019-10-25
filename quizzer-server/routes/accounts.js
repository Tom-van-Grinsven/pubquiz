'use strict';

const express   = require('express');
const mongoose  = require('mongoose');


require('../models/account.js');


const accountRouter = express.Router();

const Account  = mongoose.model('Account');


accountRouter.post('/', async function(req, res, next) {
    try {
        await Account.registerAccount(req.body.email, req.body.password);
        res.json("Ok");
    } catch (err) {
        res.json(err.message);
    }
});

module.exports = accountRouter;
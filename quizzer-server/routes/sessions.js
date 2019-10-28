'use strict';

const express   = require('express');
const mongoose  = require('mongoose');

require('../models/account.js');

const sessionRouter = express.Router();

const Account  = mongoose.model('Account');

sessionRouter.post('/', async function(req, res, next) {
    try {
        let account = await Account.loginAccount(req.body.email, req.body.password);
        res.json("Ok").status(200);
    } catch (err) {
        console.log("er is een error gegooid");
        res.json(err.message);
    }
});

module.exports = sessionRouter;
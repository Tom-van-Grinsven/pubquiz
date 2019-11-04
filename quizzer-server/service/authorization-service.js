'use strict';

const isAuthorized = (req, checkQuizOwner = true) => {
    // for testing
    // return true;

    if(req.session.account === undefined || req.session.account._id === undefined) {
        return false;
    }

    if(checkQuizOwner && req.quiz !== undefined) {
        return String(req.quiz.quizOwner) === req.session.account._id
    }

    return true;
};

module.exports.isAuthorized = isAuthorized;
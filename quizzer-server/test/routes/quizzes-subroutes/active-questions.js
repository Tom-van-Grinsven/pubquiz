let chai        = require('chai');
let chaiHttp    = require('chai-http');
let app         = require('../../../app');
let request     = require('supertest');

let getFirstQuestion    = require('./categories-questions');
let getQuizCode         = require('../quizzes');
let getTeamOneCookie      = require('./teams');

chai.use(chaiHttp);

let currentQuiz = null;
let firstQuestion = null;
let cookieForTeam1 = null;

describe('Test for active-questions endpoint', () => {
    let quizMaster = request.agent(app);
    let team       = request.agent(app);
    let scoreboard = request.agent(app);

    it('should create a quizmaster session for a valid quizmaster', function () {
        return quizMaster
            .post('/sessions')
            .send({email: 'admin@quiznight.com', password: 'wachtwoord'})
            .expect(200)
            .then((res) => {
                quizMaster.jar.setCookie(res.headers['set-cookie'][0]);
            })
    });
    it('should set the first question as active as a quizmaster', function(done) {

        getQuizCode(function(code){
            currentQuiz = code;
        });

        getFirstQuestion(function(question){
            firstQuestion = question;
        });

        quizMaster
            .put(`/quizzes/${currentQuiz}/active-questions`)
            .send({id: firstQuestion._id})
            .then(function (res) {
                res.should.have.status(204);
                done();
            })
    });
    it('should get the active question as a quizmaster', function(done) {

        getQuizCode(function(code){
            currentQuiz = code;
        });

        quizMaster
            .get(`/quizzes/${currentQuiz}/active-questions`)
            .then(function (res) {
                res.should.have.status(200);
                res.body._id.should.be.a('String');
                res.body.question.should.be.a('String');
                res.body.answer.should.be.a('String');
                res.body.category.should.be.a('String');
                res.body.isClosed.should.be.a('Boolean');
                done();
            })
    });
    it('should create a team just to have a session (i know this should be done differently but cba)', function () {

        getTeamOneCookie(function(cookie){
            cookieForTeam1 = cookie
        });

        return team.jar.setCookie(cookieForTeam1);
    });
    it('should get the active question as a team', function(done) {

        getQuizCode(function(code){
            currentQuiz = code;
        });

        team
            .get(`/quizzes/${currentQuiz}/active-questions`)
            .then(function (res) {
                res.should.have.status(200);
                res.body._id.should.be.a('String');
                res.body.question.should.be.a('String');
                res.body.category.should.be.a('String');
                res.body.isClosed.should.be.a('Boolean');
                res.body.isValidated.should.be.a('Boolean');
                done();
            })
    });
    it('should get the active question as a scoreboard', function(done) {

        getQuizCode(function(code){
            currentQuiz = code;
        });

        scoreboard
            .get(`/quizzes/${currentQuiz}/active-questions`)
            .then(function (res) {
                res.should.have.status(200);
                res.body._id.should.be.a('String');
                res.body.question.should.be.a('String');
                res.body.category.should.be.a('String');
                res.body.isClosed.should.be.a('Boolean');
                res.body.isValidated.should.be.a('Boolean');
                done();
            })
    });

});
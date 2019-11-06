let chai        = require('chai');
let chaiHttp    = require('chai-http');
let app         = require('../../../app');
let request     = require('supertest');

let getQuizCode         = require('../quizzes');
let getTeamOneCookie      = require('./teams');

chai.use(chaiHttp);

let currentQuiz = null;
let cookieForTeam1 = null;

describe('Test for active-questions answers endpoint', () => {
    let quizMaster = request.agent(app);
    let team = request.agent(app);
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
    it('should create a team just to have a session (i know this should be done differently but cba)', function () {

        getTeamOneCookie(function(cookie){
            cookieForTeam1 = cookie
        });

        return team.jar.setCookie(cookieForTeam1);
    });
    it('should give an answer to the current active question with the teamname and answer', function(done) {

        getQuizCode(function(code){
            currentQuiz = code;
        });

        team
            .put(`/quizzes/${currentQuiz}/active-questions/answers`)
            .send({teamName: "Awesome Team", answer: "The correct answer"})
            .then(function (res) {
                res.should.have.status(204);
                done();
            })
    });
    it('should not give an answer to the current active question because no answer was supplied', function(done) {

        getQuizCode(function(code){
            currentQuiz = code;
        });

        team
            .put(`/quizzes/${currentQuiz}/active-questions/answers`)
            .send({teamName: "Awesome Team"})
            .then(function (res) {
                res.should.have.status(400);
                done();
            })
    });
    it('should get the given answers by the teams. ', function(done) {

        getQuizCode(function(code){
            currentQuiz = code;
        });

        quizMaster
            .get(`/quizzes/${currentQuiz}/active-questions/answers`)
            .then(function (res) {
                res.should.have.status(200);
                res.body.answers.should.be.a('array');
                res.body.answers[0].teamName.should.eql('Awesome Team');
                res.body.answers[0].givenAnswer.should.eql('The correct answer');
                done();
            })
    });
    it('should validate the given answer on the current active question by the quizmaster', function(done) {

        getQuizCode(function(code){
            currentQuiz = code;
        });

        quizMaster
            .put(`/quizzes/${currentQuiz}/active-questions/answers`)
            .send([{teamName: "Awesome Team", isRight: true}])
            .then(function (res) {
                res.should.have.status(204);
                done();
            })
    });
    it('should set the active question as closed as a quizmaster', function(done) {

        getQuizCode(function(code){
            currentQuiz = code;
        });

        quizMaster
            .put(`/quizzes/${currentQuiz}/active-questions`)
            .send({closed: true})
            .then(function (res) {
                res.should.have.status(204);
                done();
            })
    });
    it('should get the active question as a scoreboard when its CLOSED. This should include answers', function(done) {

        getQuizCode(function(code){
            currentQuiz = code;
        });

        scoreboard
            .get(`/quizzes/${currentQuiz}/active-questions`)
            .then(function (res) {
                res.should.have.status(200);
                res.body.answer.should.be.a('String');
                done();
            })
    });
});
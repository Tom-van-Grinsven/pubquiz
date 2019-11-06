let chai        = require('chai');
let chaiHttp    = require('chai-http');
let app         = require('../../../app');
let request     = require('supertest');

let getQuizCode    = require('../quizzes');

chai.use(chaiHttp);

let currentQuiz = null;

describe('Tests for teams endpoint', () => {
    let quizMaster = request.agent(app);
    let team1 = request.agent(app);
    let team2 = request.agent(app);
    let team3 = request.agent(app);

    it('should create a quizmaster session for a valid quizmaster', function (){
        return quizMaster
            .post('/sessions')
            .send({email: 'admin@quiznight.com', password: 'wachtwoord'})
            .expect(200)
            .then((res) => {
                quizMaster.jar.setCookie(res.headers['set-cookie'][0]);
            })
    });
    it('should create a session for a team by adding itself to the quiz - Team 1', function () {

        getQuizCode(function(code){
            currentQuiz = code;
        });

        return team1
            .post(`/quizzes/${currentQuiz}/teams`)
            .send({teamName: 'Awesome Team'})
            .expect(201)
            .then((res) => {
                team1.jar.setCookie(res.headers['set-cookie'][0]);
            })
    });
    it('should create a session for a team by adding itself to the quiz - Team 2', function () {

        getQuizCode(function(code){
            currentQuiz = code;
        });

        return team2
            .post(`/quizzes/${currentQuiz}/teams`)
            .send({teamName: 'Big fat mega cool team ya yeet'})
            .expect(201)
            .then((res) => {
                team2.jar.setCookie(res.headers['set-cookie'][0]);
            })
    });
    it('should create a session for a team by adding itself to the quiz - Team 3', function () {

        getQuizCode(function(code){
            currentQuiz = code;
        });

        return team3
            .post(`/quizzes/${currentQuiz}/teams`)
            .send({teamName: 'Superduper Team'})
            .expect(201)
            .then((res) => {
                team3.jar.setCookie(res.headers['set-cookie'][0]);
            })
    });
    it('should not create a new team for a quiz because the team name is already taken', function () {

        getQuizCode(function(code){
            currentQuiz = code;
        });

        return team2
            .post(`/quizzes/${currentQuiz}/teams`)
            .send({teamName: 'Big fat mega cool team ya yeet'})
            .expect(400)
    });
    it('should get the joined teams for a quiz which should be 3', (done) => {

        getQuizCode(function(code){
            currentQuiz = code;
        });

        quizMaster
            .get(`/quizzes/${currentQuiz}/teams`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(3);
                done();
            });
    });
    it('should kick team 3 of the list', (done) => {

        getQuizCode(function(code){
            currentQuiz = code;
        });

        quizMaster
            .put(`/quizzes/${currentQuiz}/teams`)
            .send(["Awesome Team", "Big fat mega cool team ya yeet"])
            .end((err, res) => {
                res.should.have.status(204);
                done();
            });
    });
    it('should get the joined teams for a quiz which should be 2 after the kick', (done) => {

        getQuizCode(function(code){
            currentQuiz = code;
        });

        quizMaster
            .get(`/quizzes/${currentQuiz}/teams`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(2);
                done();
            });
    });
});

let chai        = require('chai');
let chaiHttp    = require('chai-http');
let request     = require('supertest')
let app         = require('../../app');

let should      = chai.should();
let {expect}    = chai;

chai.use(chaiHttp);

let quizCode = null;

describe('Test for quizzes endpoint, AUTH REQUIRED', () => {
    let agent = request.agent(app);
    it('should create a quizmaster session for a valid quizmaster', function (){
        return agent
            .post('/sessions')
            .send({email: 'admin@quiznight.com', password: 'wachtwoord'})
            .expect(200)
            .then((res) => {
                agent.jar.setCookie(res.headers['set-cookie'][0]);
            })
    });
    it('should create a new quiz after a valid quizmaster login', function(done) {
        agent
            .post('/quizzes')
            .send({quizName: "testQuiz"})
            .then(function (res) {
                res.should.have.status(201);
                res.body.should.be.a('Object');
                res.body.quizCode.should.be.a('String');
                quizCode = res.body.quizCode;
                done();
            })
    });
    it('should get a quiz based on newly created quiz', function(done) {
        agent
            .get(`/quizzes/${quizCode}`)
            .then(function (res) {
                res.should.have.status(200);
                res.body.should.be.a('Object');
                res.body.code.should.be.a('String');
                res.body.isActive.should.be.a('Boolean');
                res.body.isOpen.should.be.a('Boolean');
                res.body.roundNumber.should.be.eql(0);
                res.body.questionNumber.should.be.eql(0);
                res.body.name.should.be.eql('testQuiz');
                done();
            })
    });
    it('should NOT get a quiz because the quiz you want to join does not exist', function(done) {
        agent
            .get(`/quizzes/dezequizbestaatniet`)
            .then(function (res) {
                res.should.have.status(404);
                done();
            })
    });
    it('should set the quiz on active and thus joinable by teams', function(done) {
        agent
            .put(`/quizzes/${quizCode}`)
            .send({isActive: true})
            .expect(204)
            .then(function() {
                done();
            })
    });
});

describe('Test for quizzes endpoint, NO AUTHORIZATION', () => {
    let agent = request.agent(app);
    it('should not be able to create a new quiz because there is no authorization', function(done) {
        agent
            .post('/quizzes')
            .send({quizName: "testQuiz"})
            .then(function (res) {
                res.should.have.status(403);
                done();
            })
    });
});

module.exports = function getQuizCode(callback){
    return callback(quizCode);
};
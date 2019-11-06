let chai        = require('chai');
let chaiHttp    = require('chai-http');
let app         = require('../../../app');
let request     = require('supertest');

let getFirstQuestion  = require('./categories-questions');
let getQuizCode    = require('../quizzes');

chai.use(chaiHttp);

let currentQuiz = null;
let firstQuestion = null;

describe('Test for active-questions endpoint', () => {
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
    it('should get the active question with answer as a quizmaster', function(done) {

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
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.eql(12);
                done();
            })
    });
});
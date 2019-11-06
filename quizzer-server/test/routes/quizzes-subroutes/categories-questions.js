let chai        = require('chai');
let chaiHttp    = require('chai-http');
let app         = require('../../../app');
let request     = require('supertest');

let getQuizCode    = require('../quizzes');

chai.use(chaiHttp);

let currentQuiz = null;

let firstQuestion = null;

describe('Test for category question sub endpoint, AUTHORIZATION REQUIRED', () => {
    let quizMaster = request.agent(app);

    it('should create a quizmaster session for a valid quizmaster', function () {
        return quizMaster
            .post('/sessions')
            .send({email: 'admin@quiznight.com', password: 'wachtwoord'})
            .expect(200)
            .then((res) => {
                quizMaster.jar.setCookie(res.headers['set-cookie'][0]);
            })
    });
    it('should get the questions categories for a new round', function(done) {

        getQuizCode(function(code){
            currentQuiz = code;
        });

        quizMaster
            .get(`/quizzes/${currentQuiz}/categories/questions`)
            .then(function (res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.eql(12);
                firstQuestion = res.body[0];
                done();
            })
    });
});

describe('Test for category question sub endpoint, NOT AUTHORIZED', () => {
    let quizMaster = request.agent(app);

    it('should not get questions for a new round because the quizmaster is not authorized', function(done) {

        getQuizCode(function(code){
            currentQuiz = code;
        });

        quizMaster
            .get(`/quizzes/${currentQuiz}/categories/questions`)
            .then(function (res) {
                res.should.have.status(403);
                done();
            })
    });
});

module.exports = function getFirstQuestion(callback){
    return callback(firstQuestion);
};
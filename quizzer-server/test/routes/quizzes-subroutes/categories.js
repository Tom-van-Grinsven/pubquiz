let chai        = require('chai');
let chaiHttp    = require('chai-http');
let app         = require('../../../app');
let request     = require('supertest');

let getQuizCode    = require('../quizzes');

chai.use(chaiHttp);

let currentQuiz = null;


describe('Test for category sub endpoint', () => {
    let quizMaster = request.agent(app);

    it('should create a quizmaster session for a valid quizmaster', function (){
        return quizMaster
            .post('/sessions')
            .send({email: 'admin@quiznight.com', password: 'wachtwoord'})
            .expect(200)
            .then((res) => {
                quizMaster.jar.setCookie(res.headers['set-cookie'][0]);
            })
    });
    it('should set categories for a round', function(done) {

        getQuizCode(function(code){
            currentQuiz = code;
        });

        quizMaster
            .put(`/quizzes/${currentQuiz}/categories`)
            .send(["Art and Literature", "History", "TV and Film"])
            .then(function (res) {
                res.should.have.status(204);
                done();
            })
    });
    it('should NOT set categories for a round because no body was given', function(done) {

        getQuizCode(function(code){
            currentQuiz = code;
        });

        quizMaster
            .put(`/quizzes/${currentQuiz}/categories`)
            .send(["Art Literature", "History"])
            .then(function (res) {
                res.should.have.status(400);
                done();
            })
    });
});
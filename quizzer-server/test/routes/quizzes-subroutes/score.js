let chai        = require('chai');
let chaiHttp    = require('chai-http');
let app         = require('../../../app');
let request     = require('supertest');

let getQuizCode    = require('../quizzes');

chai.use(chaiHttp);

let currentQuiz = null;


describe('Test for score sub endpoint', () => {
    let agent = request.agent(app);

    it('should get the score of the newly made quiz', function(done) {

        getQuizCode(function(code){
            currentQuiz = code;
        });

        agent
            .get(`/quizzes/${currentQuiz}/score`)
            .then(function (res) {
                res.should.have.status(200);
                done();
            })
    });
    it('should not get a score because the quiz does not exist', function(done) {
        agent
            .get(`/quizzes/dezequizbestaatniet/score`)
            .then(function (res) {
                res.should.have.status(404);
                done();
            })
    });
});
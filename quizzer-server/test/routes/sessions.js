let chai        = require('chai');
let chaiHttp    = require('chai-http');
let app         = require('../../app');
let request     = require('supertest');

chai.use(chaiHttp);

describe('Tests for sessions endpoint', () => {
    let agent = request.agent(app);
    it('it should login with a valid username + password combination', (done) => {
        agent
           .post('/sessions')
           .send({email: 'admin@quiznight.com', password: 'wachtwoord'})
           .end((err, res) => {
               res.should.have.status(200);
               done();
           })
   });
    it('it should NOT login with an INVALID username + password combination', (done) => {
        agent
            .post('/sessions')
            .send({email: 'admin@quiznight.com', password: 'asdfqwersdfgh'})
            .end((err, res) => {
                res.should.have.status(401);
                done();
            })
    })
});
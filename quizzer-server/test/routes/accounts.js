let chai        = require('chai');
let chaiHttp    = require('chai-http');
let app         = require('../../app');
let request     = require('supertest');

chai.use(chaiHttp);

describe('Tests for accounts endpoint', () => {
    let agent = request.agent(app);
    it('it should create a valid quizmaster login (with a random email)', (done) => {
        agent
            .post('/accounts')
            .send({email: `${getRandomCodeForEmail()}@quiznight.com`, password: 'wachtwoord'})
            .end((err, res) => {
                res.should.have.status(201);
                done();
            })
    });
    it('it should not create a valid quizmaster login because the email is already taken', (done) => {
        agent
            .post('/accounts')
            .send({email: 'admin@quiznight.com', password: 'asdfqwersdfgh'})
            .end((err, res) => {
                res.should.have.status(400);
                res.body.err.should.be.eql('This email is already taken');
                done();
            })
    })
});

getRandomCodeForEmail = () => {
    return Math.random().toString(36).substr(2, 6);
};

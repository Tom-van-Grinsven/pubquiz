let chai        = require('chai');
let chaiHttp    = require('chai-http');
let request     = require('supertest');
let app         = require('../../app');

chai.use(chaiHttp);

describe('Tests for categories endpoint', () => {
    let agent = request.agent(app);
    it('should get the distinct categories of the questions', (done) => {
        agent
            .get('/categories')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.eql(8);
                done();
            })
    });
});
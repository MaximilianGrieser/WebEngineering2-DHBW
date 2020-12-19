//Require the dev-dependencies
//import * as browser from "express/lib/request";

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('Users', () => {
    /*
  * Test the /GET route
  */
    describe('/GET users', () => {
        it('it should GET all the users', (done) => {
            chai.request(server)
                .get('/users')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
                    done();
                });
        });
    });
    /*
    describe('/POST user', () => {
        it('it should not POST a user without password field', (done) => {
            let user = {
                userID: "FranFine",
            }
            chai.request(server)
                .post('/users')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('errors');
                    res.body.errors.should.have.property('password');
                    res.body.errors.password.should.have.property('kind').eql('required');
                    done();
                });
        });

    });

     */
});

describe('Groups', () => {
    /*
  * Test the /GET route
  */
    describe('/GET groups', () => {
        it('it should GET all the groups', (done) => {
            chai.request(server)
                .get('/groups')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
                    done();
                });
        });
    });
});





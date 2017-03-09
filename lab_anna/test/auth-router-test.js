'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const serverToggle = require('./lib/server-toggle.js');
const User = require('../model/user.js');

mongoose.Promise = Promise;

const server = require('../server.js');
const url = `http://localhost:${process.env.PORT}`;

const exampleUser = {
  username: 'exampleuser',
  password: '1234',
  email: 'exampleuser@test.com'
};

describe('Auth Routes', function() {

  before( done => {
    serverToggle.serverOn(server, done);
  });

  after( done => {
    serverToggle.serverOff(server, done);
  });

    describe('POST: /api/signup', function() {
      after( done => {
        User.remove({})
        .then( () => done())
        .catch(done);
      });

      describe('with a valid body', function() {
        it('should return a token', done => {
          request.post(`${url}/api/signup`)
          .send(exampleUser)
          .end((err, res) => {
            if (err) return done(err);
            console.log('\ntoken: ', res.text, '\n');
            expect(res.status).to.equal(200);
            expect(res.text).to.be.a('string');
            done();
          });
        });
      });
    });

  describe('GET: /api/signin', function() {
    describe('with a valid body', function() {
      before( done => {
        let user = new User(exampleUser);
        user.generatePasswordHash(exampleUser.password)
        .then( user => user.save())
        .then( user => {
          this.tempUser = user;
          done();
        })
        .catch(done);
      });

      after( done => {
        User.remove({})
        .then( () => done())
        .catch(done);
      });

      it('should return a token', done => {
        request.get(`${url}/api/signin`)
        .auth('exampleuser', '1234')
        .end((err, res) => {
          if (err) return done(err);
          console.log('\nuser:', this.tempUser);
          console.log('\ntoken:', res.text);
          expect(res.status).to.equal(200);
          done();
        });
      });
    });
  });
});

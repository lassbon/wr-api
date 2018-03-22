'use strict';

let server = require('server');
let request = require('supertest')(server);
let joi = require('joi');
let authenticationHelper = require('test/helpers/authentication');

describe('POST /v1/login', () => {

    it(`should show an authorisation error if an invalid credential is supplied`, done => {

        request.post(`/v1/login`)
            .send(authenticationHelper.invalidCredentialsFixture())
            .expect('Content-type', 'application/json')
            .expect(401)
            .expect(res => {
                const schema = {
                    status: joi.string().valid('error').required(),
                    message: joi.string().valid('Unauthorized').required(),
                    code: joi.string().valid('UNAUTHORIZED').required()
                };

                joi.assert(res.body, schema);
            })
            .end(done);

    });

    it(`should successfully return a JWT if valid credentials is supplied`, done => {

        request.post(`/v1/login`)
            .send(authenticationHelper.fixture())
            .expect('Content-type', 'application/json')
            .expect(200)
            .expect(res => {
                const schema = {
                    status: joi.string().valid('success').required(),
                    data: joi.object().keys({
                        token: joi.string()
                    })
                };

                joi.assert(res.body, schema);
            })
            .end(done);

    });

});

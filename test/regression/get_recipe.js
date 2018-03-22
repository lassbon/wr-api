'use strict';

let server = require('server');
let request = require('supertest')(server);
let joi = require('joi');
let authenticationHelper = require('test/helpers/authentication');

const VALID_RECIPE_ID = 1;
const NON_EXISTENT_RECIPE_ID = 14434355562;

describe('GET /v1/recipes/:id', () => {

    let token;

    authenticationHelper.login().then((resp) => {
        token = resp.token;
    });

    it(`should show an authorization error if invalid x-user-token header is supplied`, done => {

        request.get(`/v1/recipes/${VALID_RECIPE_ID}`)
            .set('x-user-token', 'invalid:')
            .send()
            .expect('Content-type', 'application/json')
            .expect(401)
            .expect(res => {
                const schema = {
                    status: joi.string().valid('error').required(),
                    message: joi.string().valid('Unauthorized').required()
                };

                joi.assert(res.body, schema);
            })
            .end(done);

    });

    it(`should show an authorisation error no x-user-token is supplied`, done => {

        request.get(`/v1/recipes`)
            .send()
            .expect('Content-type', 'application/json')
            .expect(401)
            .expect(res => {
                const schema = {
                    status: joi.string().valid('error').required(),
                    message: joi.string().valid('Unauthorized').required()
                };

                joi.assert(res.body, schema);
            })
            .end(done);

    });

    it('should successfully fetch a single recipe', done => {

        request.get(`/v1/recipes/${VALID_RECIPE_ID}`)
            .set('x-user-token', token)
            .send()
            .expect('Content-type', 'application/json')
            .expect(200)
            .expect(res => {

                const schema = {
                    status: joi.string().valid('success').required(),
                    data: joi.object().keys({
                        name: joi.string().required(),
                        prep_time: joi.number().integer().positive().required(),
                        difficulty: joi.number().integer().min(1).max(3).required(),
                        vegetarian: joi.boolean().required(),
                        created_at: joi.date().required(),
                        id: joi.number().positive().required(),
                        ratings: joi.array().items(
                            joi.object().keys({
                                rating: joi.number().required(),
                                comment: joi.string().required(),
                                rated_by: joi.string().required(),
                                created_at: joi.date().required()
                            })
                        )
                    })
                };

                joi.assert(res.body, schema);
            })
            .end(done);
    });

    it('should return 404 error when attempting to fetch a non-existent recipe', done => {

        request.get(`/v1/recipes/${NON_EXISTENT_RECIPE_ID}`)
            .set('x-user-token', token)
            .send()
            .expect('Content-type', 'application/json')
            .expect(404)
            .expect(res => {

                const schema = {
                    status: joi.string().valid('error').required(),
                    message: joi.string().valid('Recipe not found').required(),
                    code: joi.string().valid('RECIPE_NOT_FOUND').required()
                };

                joi.assert(res.body, schema);
            })
            .end(done);
    });

});

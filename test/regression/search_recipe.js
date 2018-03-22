'use strict';

let server = require('server');
let request = require('supertest')(server);
let joi = require('joi');
let authenticationHelper = require('test/helpers/authentication');

describe('GET /v1/search', () => {

    let token;

    authenticationHelper.login().then((resp) => {
        token = resp.token;
    });

    it(`should show an authorisation error if an invalid x-user-token is supplied`, done => {

        request.get(`/v1/search`)
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

    it(`should show an authorisation error if no x-user-token header is supplied`, done => {

        request.get(`/v1/search`)
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

    it('should successfully fetch a list of recipes', done => {

        let pages = { limit: 2, offset: 0 };

        request.get(`/v1/search?limit=${pages.limit}`)
            .set('x-user-token', token)
            .send()
            .expect('Content-type', 'application/json')
            .expect(200)
            .expect(res => {

                const schema = {
                    status: joi.string().valid('success').required(),
                    data: joi.object().keys({
                        limit: pages.limit,
                        offset: pages.offset,
                        total: res.body.data.total,
                        query: joi.object().keys({
                            match_all: joi.object().required()
                        }),
                        recipes: joi.array().items(
                            joi.object().keys({
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

                        )
                    })
                };

                joi.assert(res.body, schema);
            })
            .end(done);
    });

});

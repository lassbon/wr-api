'use strict';

let server = require('server');
let request = require('supertest')(server);
let joi = require('joi');
let recipeHelper = require('test/helpers/recipe');
let authenticationHelper = require('test/helpers/authentication');

describe('GET /v1/recipes', () => {

    let token;

    authenticationHelper.login().then((resp) => {
        token = resp.token;
    });

    let filterFields = ['prep_time', 'difficulty', 'vegetarian'];

    filterFields.forEach(field => {
        it(`should show an error if an invalid value is passed as ${field}`, done => {
            let params = Object.assign({}, recipeHelper.invalidDataFixture());
            let pattern = new RegExp(field, 'g');

            request.get(`/v1/recipes?${field}=${params[field]}`)
                .set('x-user-token', token)
                .send()
                .expect('Content-type', 'application/json')
                .expect(400)
                .expect(res => {
                    const schema = {
                        status: joi.string().valid('error').required(),
                        message: joi.string().regex(pattern).required(),
                        code: joi.string().valid('INVALID_PARAMS').required()
                    };

                    joi.assert(res.body, schema);
                })
                .end(done);

        });
    });

    it(`should show an authorisation error if an invalid x-user-token is supplied`, done => {

        request.get(`/v1/recipes`)
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

    it('should successfully fetch a list of recipes', done => {

        let pages = { limit: 2, offset: 0 };

        request.get(`/v1/recipes?limit=${pages.limit}`)
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
                        filters: joi.object().keys({
                            name: joi.string().optional(),
                            prep_time: joi.number().integer().positive().optional(),
                            difficulty: joi.number().integer().positive().optional(),
                            vegetarian: joi.boolean().optional()
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
                                    }).optional()
                                )
                            })

                        )
                    })
                };

                joi.assert(res.body, schema);
            })
            .end(done);
    });

    it('should return empty data for non-existing pages', done => {

        let pages = { limit: 10, offset: 49403049490 };

        request.get(`/v1/recipes?limit=${pages.limit}&offset=${pages.offset}`)
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
                        filters: joi.object().keys({
                            name: joi.string().optional(),
                            prep_time: joi.number().integer().positive().optional(),
                            difficulty: joi.number().integer().positive().optional(),
                            vegetarian: joi.boolean().optional()
                        }),
                        recipes: joi.array().length(0).required()
                    })
                };

                joi.assert(res.body, schema);
            })
            .end(done);
    });

});

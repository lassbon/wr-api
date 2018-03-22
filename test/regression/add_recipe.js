'use strict';

let server = require('server');
let request = require('supertest')(server);
let joi = require('joi');
let recipeHelper = require('test/helpers/recipe');
let faker = require('faker');

const INVALID_RECIPE_NAME = 153899;
const INVALID_PREP_TIME_VALUE = ':invalid';
const INVALID_DIFFICULTY_VALUE = ':invalid';
const INVALID_VEGETARIAN_VALUE = ':invalid';

describe('POST /v1/recipes', () => {

    it('should return a validation error response when supplied an invalid recipe name', (done) => {

            request.post(`/v1/recipes`)
                .send({
                    name: INVALID_RECIPE_NAME,
                    prep_time: faker.random.number({ min: 10, max: 120 }),
                    difficulty: faker.random.number({ min: 1, max: 3 }),
                    vegetarian: faker.random.boolean()
                })
                .expect('Content-type', 'application/json')
                .expect(400)
                .expect(res => {
                    const schema = {
                        status: joi.string().valid('error').required(),
                        message: joi.string().regex(/name/).required(),
                        code: joi.string().valid('INVALID_PARAMS').required()
                    };

                    joi.assert(res.body, schema);
                })
                .end(done);
        });

    it('should return a validation error response when supplied an invalid prep_time value', (done) => {

            request.post(`/v1/recipes`)
                .send({
                    name: faker.commerce.productName(),
                    prep_time: INVALID_PREP_TIME_VALUE,
                    difficulty: faker.random.number({ min: 1, max: 3 }),
                    vegetarian: faker.random.boolean()
                })
                .expect('Content-type', 'application/json')
                .expect(400)
                .expect(res => {
                    const schema = {
                        status: joi.string().valid('error').required(),
                        message: joi.string().regex(/prep_time/).required(),
                        code: joi.string().valid('INVALID_PARAMS').required()
                    };

                    joi.assert(res.body, schema);
                })
                .end(done);
        });

    it('should return a validation error response when supplied an invalid difficulty value', (done) => {

            request.post(`/v1/recipes`)
                .send({
                    name: faker.commerce.productName(),
                    prep_time: faker.random.number({ min: 10, max: 120 }),
                    difficulty: INVALID_DIFFICULTY_VALUE,
                    vegetarian: faker.random.boolean()
                })
                .expect('Content-type', 'application/json')
                .expect(400)
                .expect(res => {
                    const schema = {
                        status: joi.string().valid('error').required(),
                        message: joi.string().regex(/difficulty/, joi.number()),
                        code: joi.string().valid('INVALID_PARAMS').required()
                    };

                    joi.assert(res.body, schema);
                })
                .end(done);
        });

    it('should return a validation error response when supplied an invalid "vegetarian" value', (done) => {

            request.post(`/v1/recipes`)
                .send({
                    name: faker.commerce.productName(),
                    prep_time: faker.random.number(),
                    difficulty: faker.random.number({ min: 1, max: 3 }),
                    vegetarian: INVALID_VEGETARIAN_VALUE
                })
                .expect('Content-type', 'application/json')
                .expect(400)
                .expect(res => {
                    const schema = {
                        status: joi.string().valid('error').required(),
                        message: joi.string().regex(/vegetarian/, joi.boolean()).required(),
                        code: joi.string().valid('INVALID_PARAMS').required()
                    };

                    joi.assert(res.body, schema);
                })
                .end(done);
        });

    let requiredFields = ['name', 'prep_time', 'difficulty', 'vegetarian'];

    requiredFields.forEach(field => {
        it(`should make sure that ${field} is required`, done => {
            let params = Object.assign({}, recipeHelper.fixture());
            delete params[field];
            let pattern = new RegExp(field, 'g');

            request.post(`/v1/recipes`)
                .send(params)
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

    it('should successfully add a recipe', (done) => {
        let payload = recipeHelper.fixture();

        request.post(`/v1/recipes`)
            .send(payload)
            .expect('Content-type', 'application/json')
            .expect(201)
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

    it('should send duplicate error when creating a recipe with an already existing name', (done) => {

        let payload = recipeHelper.fixture();

        recipeHelper.create(payload.name, payload.prep_time, payload.difficulty, payload.vegetarian)
            .then(() => {
                request.post(`/v1/recipes`)
                    .send(payload) //sending payload a 2nd time to simulate duplicate name exception
                    .expect('Content-type', 'application/json')
                    .expect(400)
                    .expect(res => {
                        const schema = {
                            status: joi.string().valid('error').required(),
                            message: joi.string().valid('Recipe with the same name has already been created')
                                .required(),
                            code: joi.string().valid('DUPLICATE_RECIPE_NAME').required()
                        };
                        joi.assert(res.body, schema);
                    })
                    .end(done);
            });
    });
});

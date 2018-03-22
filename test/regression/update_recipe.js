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

const VALID_RECIPE_ID = 1;

describe('PUT /v1/recipes/:id', () => {

    it('should return a validation error response, when supplied an invalid recipe_id', (done) => {

        let payload = recipeHelper.fixture();

        request.put(`/v1/recipes/:invalid_value!`)
            .send(payload)
            .expect('Content-type', 'application/json')
            .expect(400)
            .expect(res => {
                const schema = {
                    status: joi.string().valid('error').required(),
                    message: joi.string().regex(/id/).required(),
                    code: joi.string().valid('INVALID_PARAMS').required()
                };

                joi.assert(res.body, schema);
            })
            .end(done);
    });

    it('should return a validation error response when supplied an invalid recipe name', (done) => {

        request.put(`/v1/recipes/${VALID_RECIPE_ID}`)
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

        request.put(`/v1/recipes/${VALID_RECIPE_ID}`)
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

        request.put(`/v1/recipes/${VALID_RECIPE_ID}`)
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

        request.put(`/v1/recipes/${VALID_RECIPE_ID}`)
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

    it('should return a error on attempt to update non-existing recipe', (done) => {

        request.put(`/v1/recipes/1234567899091`)
            .send({ name: 'fake' })
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

    it('should successfully update existing recipe', (done) => {

        let payload = recipeHelper.fixture();
        let updatePayload = recipeHelper.fixture();

        recipeHelper.create(payload.name, payload.prep_time, payload.difficulty, payload.vegetarian)
            .then(recipe => {
                request.put(`/v1/recipes/${recipe.get('id')}`)
                    .send(updatePayload)
                    .expect('Content-type', 'application/json')
                    .expect(200)
                    .expect(res => {
                        const schema = {
                            status: joi.string().valid('success').required(),
                            data: joi.object().keys({
                                name: joi.string().valid(updatePayload.name).required(),
                                prep_time: joi.number().valid(updatePayload.prep_time).required(),
                                difficulty: joi.number().valid(updatePayload.difficulty).required(),
                                vegetarian: joi.boolean().valid(updatePayload.vegetarian).required(),
                                created_at: joi.date().required(),
                                id: joi.number().valid(recipe.get('id')).required(),
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
    });

    it('should return a duplicate error on attempt to update a recipe with an already existing name', (done) => {

        let payload1 = recipeHelper.fixture();
        let payload2 = recipeHelper.fixture();

        recipeHelper.create(payload1.name, payload1.prep_time, payload1.difficulty, payload1.vegetarian)
            .then(() => recipeHelper.create(payload2.name, payload2.prep_time, payload2.difficulty,
                payload2.vegetarian))
            .then(secondRecipeResult => {
                request.put(`/v1/recipes/${secondRecipeResult.get('id')}`)
                    .send({ name: payload1.name })
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

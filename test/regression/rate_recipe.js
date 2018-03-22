'use strict';

let server = require('server');
let request = require('supertest')(server);
let joi = require('joi');
let recipeHelper = require('test/helpers/recipe');
let faker = require('faker');
let authenticationHelper = require('test/helpers/authentication');

const INVALID_RATING = ':invalid';

const VALID_RECIPE_ID = 1;

describe('PUT /v1/recipes/:id/rate', () => {

    let token;

    authenticationHelper.login().then((resp) => {
        token = resp.token;
    });

    it('should return a validation error response, when supplied an invalid recipe_id', (done) => {

        let payload = recipeHelper.ratingFixture();

        request.put(`/v1/recipes/:invalid_value!/rate`)
            .set('x-user-token', token)
            .send(payload)
            .expect('Content-type', 'application/json')
            .expect(400)
            .expect(res => {
                const schema = {
                    status: joi.string().valid('error').required(),
                    message: joi.string().regex(/id/, joi.number()).required(),
                    code: joi.string().valid('INVALID_PARAMS').required()
                };

                joi.assert(res.body, schema);
            })
            .end(done);
    });

    it('should return a validation error response, when rating is not provided', (done) => {

        let payload = recipeHelper.ratingFixture();
        delete payload.rating;

        request.put(`/v1/recipes/${VALID_RECIPE_ID}/rate`)
            .set('x-user-token', token)
            .send(payload)
            .expect('Content-type', 'application/json')
            .expect(400)
            .expect(res => {
                const schema = {
                    status: joi.string().valid('error').required(),
                    message: joi.string().regex(/rating/).required(),
                    code: joi.string().valid('INVALID_PARAMS').required()
                };

                joi.assert(res.body, schema);
            })
            .end(done);
    });

    it('should return a validation error response when supplied an invalid rating', (done) => {

        request.put(`/v1/recipes/${VALID_RECIPE_ID}/rate`)
            .set('x-user-token', token)
            .send({
                rating: INVALID_RATING,
                comment: faker.lorem.sentence(),
                rated_by: faker.internet.userName(),
            })
            .expect('Content-type', 'application/json')
            .expect(400)
            .expect(res => {
                const schema = {
                    status: joi.string().valid('error').required(),
                    message: joi.string().regex(/rating/).required(),
                    code: joi.string().valid('INVALID_PARAMS').required()
                };

                joi.assert(res.body, schema);
            })
            .end(done);
    });

    it('should return a validation error response when supplied rating is greater than 5', (done) => {

        let payload = recipeHelper.invalidRatingFixture();

        request.put(`/v1/recipes/${VALID_RECIPE_ID}/rate`)
            .set('x-user-token', token)
            .send(payload)
            .expect('Content-type', 'application/json')
            .expect(400)
            .expect(res => {
                const schema = {
                    status: joi.string().valid('error').required(),
                    message: joi.string().regex(/rating/, joi.number().min(1).max(5)).required(),
                    code: joi.string().valid('INVALID_PARAMS').required()
                };

                joi.assert(res.body, schema);
            })
            .end(done);
    });

    it('should return a error on attempt to rate a non-existing recipe', (done) => {

        let payload = recipeHelper.ratingFixture();

        request.put(`/v1/recipes/1234567899091/rate`)
            .send(payload)
            .set('x-user-token', token)
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

    it('should show an authorization error when attempting to rate a recipe without Jwt header', (done) => {

        let payload = recipeHelper.fixture();
        let ratingPayload = recipeHelper.ratingFixture();

        recipeHelper.create(payload.name, payload.prep_time, payload.difficulty, payload.vegetarian)
            .then(recipe => {
                request.put(`/v1/recipes/${recipe.get('id')}/rate`)
                    .send(ratingPayload)
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
    });

    it('should successfully rate an existing recipe with JWT present', (done) => {

        let payload = recipeHelper.fixture();
        let ratingPayload = recipeHelper.ratingFixture();

        recipeHelper.create(payload.name, payload.prep_time, payload.difficulty, payload.vegetarian)
            .then(recipe => {
                request.put(`/v1/recipes/${recipe.get('id')}/rate`)
                    .set('x-user-token', token)
                    .send(ratingPayload)
                    .expect('Content-type', 'application/json')
                    .expect(200)
                    .expect(res => {
                        const schema = {
                            status: joi.string().valid('success').required(),
                            data: joi.object().keys({
                                name: joi.string().valid(payload.name).required(),
                                prep_time: joi.number().valid(payload.prep_time).required(),
                                difficulty: joi.number().valid(payload.difficulty).required(),
                                vegetarian: joi.boolean().valid(payload.vegetarian).required(),
                                created_at: joi.date().required(),
                                id: joi.number().valid(recipe.get('id')).required(),
                                ratings: joi.array().items(
                                    joi.object().keys({
                                        rating: joi.number().valid(ratingPayload.rating),
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

});

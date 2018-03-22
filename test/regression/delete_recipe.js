'use strict';

let server = require('server');
let request = require('supertest')(server);
let joi = require('joi');
let recipeHelper = require('test/helpers/recipe');
let assert = require('chai').assert;

describe('DELETE /v1/recipes', () => {

    it('should return a validation error response when supplied an invalid id', (done) => {

        request.delete(`/v1/recipes/:invalid_id`)
        .send({})
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

    it('should return a error on attempt to delete non-existing recipe', (done) => {

        request.delete(`/v1/recipes/123456789`)
        .send({})
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

    it('should successfully delete an existing recipe', (done) => {

        recipeHelper.create()
        .then(recipe => {
            request.delete(`/v1/recipes/${recipe.get('id')}`)
            .send({})
            .expect('Content-type', 'application/json')
            .expect(200)
            .expect(res => {
                const schema = {
                    status: joi.string().valid('success').required(),
                    message: joi.string().valid('Recipe with the same name has already been created').required(),
                    code: joi.string().valid('DUPLICATE_RECIPE_NAME').required()
                };
                joi.assert(res.body, schema);
            })
            .end(() => {
                recipe.refresh().then(recipe => {
                    assert.isNull(recipe, 'Recipe should not exist in the database');
                    done();
                }).catch(error => done(error));
            });
        });
    });

});

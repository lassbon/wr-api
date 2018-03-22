'use strict';

let serviceLocator = require('app/config/di');
let service = serviceLocator.get('recipeService');
let faker = require('faker');

module.exports = class Recipe {

    static fixture() {
        return {
            name: faker.commerce.productName(),
            prep_time: faker.random.number({ min: 10, max: 120 }),
            difficulty: faker.random.number({ min: 1, max: 3 }),
            vegetarian: faker.random.boolean()
        };
    }

    static invalidDataFixture() {
        return {
            name: faker.random.number(),
            prep_time: faker.commerce.productName(),
            difficulty: faker.commerce.productName(),
            vegetarian: faker.commerce.productName()
        };
    }

    static ratingFixture() {
        return {
            rating: faker.random.number({ min: 1, max: 5 }),
            comment: faker.lorem.sentence(),
            rated_by: faker.internet.userName(),
        };
    }

    static invalidRatingFixture() {
        return {
            rating: faker.random.number({ min: 100, max: 900 }),
            comment: faker.lorem.sentence(),
            rated_by: faker.internet.userName(),
        };
    }

    static create(name, prepTime, difficulty, vegetarian) {
        if (name) {
            return service.create(name, prepTime, difficulty, vegetarian);
        }

        //use fixture if no argument was passed
        let payload = this.fixture();
        return service.create(payload.name, payload.prep_time, payload.difficulty, payload.vegetarian);
    }
};

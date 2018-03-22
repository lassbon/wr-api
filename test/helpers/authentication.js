'use strict';

let serviceLocator = require('app/config/di');
let config = require('app/config/config');
let service = serviceLocator.get('accountService');
let faker = require('faker');

module.exports = class authentication {

    static fixture() {
        return {
            username: config.apiTestUser.userName,
            password: config.apiTestUser.password
        };
    }

    static invalidCredentialsFixture() {
        return {
            username: faker.internet.userName(),
            password: faker.internet.password()
        };
    }

    static login() {

        let payload = this.fixture();
        return service.login(payload.username, payload.password);
    }
};

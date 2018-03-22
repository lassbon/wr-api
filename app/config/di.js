'use strict';

let config = require('app/config/config');
let serviceLocator = require('app/lib/service_locator');
let Logger = require('app/lib/logger');
let RecipeController = require('app/controllers/recipe');
let RecipeService = require('app/services/recipe');
let AccountController = require('app/controllers/account');
let AccountService = require('app/services/account');

/**
 * Creates an instance of the Account controller
 */
serviceLocator.register('accountController', (serviceLocator) => {
    let accountService = serviceLocator.get('accountService');

    return new AccountController(accountService);
});

/**
 * Creates an instance of the Account service
 */
serviceLocator.register('accountService', (serviceLocator) => {

    let logger = serviceLocator.get('logger');

    return new AccountService(logger);
});

/**
 * Creates an instance of the logger
 */
serviceLocator.register('logger', () => {

    return Logger.create(config.logging);
});

module.exports = serviceLocator;

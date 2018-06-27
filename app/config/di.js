'use strict';

let config = require('app/config/config');
let serviceLocator = require('app/lib/service_locator');
let NotificationLib = require('app/lib/notifications');
let Logger = require('app/lib/logger');

let AccountController = require('app/controllers/account');
let QuestionController = require('app/controllers/question');

let AccountService = require('app/services/account');
let QuestionService = require('app/services/question');

/**
 * Creates an instance of the Account controller
 */
serviceLocator.register('accountController', (serviceLocator) => {
    let accountService = serviceLocator.get('accountService');

    return new AccountController(accountService);
});

/**
 * Creates an instance of the Question controller
 */
serviceLocator.register('questionController', (serviceLocator) => {
    let accountService = serviceLocator.get('questionService');

    return new QuestionController(accountService);
});

/**
 * Creates an instance of the Account service
 */
serviceLocator.register('accountService', (serviceLocator) => {

    let logger = serviceLocator.get('logger');
    let notificationLib = serviceLocator.get('notificationLib');

    return new AccountService(logger, notificationLib);
});

/**
 * Creates an instance of the Question service
 */
serviceLocator.register('questionService', (serviceLocator) => {

    let logger = serviceLocator.get('logger');
    let notificationLib = serviceLocator.get('notificationLib');

    return new QuestionService(logger, notificationLib);
});

/**
 * Creates an instance of the Notification Library
 */
serviceLocator.register('notificationLib', (serviceLocator) => {
    
    // Twilio Credentials
    const accountSid = config.OTPsetupDetails.accountSid;
    const authToken = config.OTPsetupDetails.authToken;

    let logger = serviceLocator.get('logger');
    let smsClient = require('twilio')(accountSid, authToken);
    return new NotificationLib(logger, smsClient);
});

/**
 * Creates an instance of the logger
 */
serviceLocator.register('logger', () => {

    return Logger.create(config.logging);
});

module.exports = serviceLocator;

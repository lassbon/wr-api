'use strict';

let User = require('app/models/user');
let UserType = require('app/models/usertype');
let Question = require('app/models/question');
let shortid = require('shortid');
var shortIdGen = require('short-id-gen');
let constants = require('app/config/constants');
let config = require('app/config/config');
let errors = require('app/errors');
let bcrypt = require('bcryptjs');
let jwt = require('jsonwebtoken');

class ResourceService {

    /**
     * Resource service constructor
     *
     * @constructor
     * @param {logger} logger instance of the logger
     * @param {logger} logger instance of the notification library
     */
    constructor(logger, notificationLib) {
        this.notification = notificationLib;
        this.logger = logger;
    }

}

module.exports = ResourceService;

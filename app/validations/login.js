'use strict';

let joi = require('joi');

module.exports = {
    username: joi.string().required(),
    password: joi.string().required()
};

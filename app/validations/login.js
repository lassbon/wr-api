'use strict';

let joi = require('joi');

module.exports = {
    email: joi.string().required(),
    password: joi.string().required()
};

'use strict';

let joi = require('joi');

module.exports = {
    userFirstname: joi.string().required(),
    userLastname: joi.string().required(),
    userPhoneNumber: joi.string().required(),
    userEmail: joi.string().email().required(),
    userAccountNumber: joi.string().required(),
    userBVN: joi.string().required(),
    difficulty: joi.number().integer().min(1).max(3).required(),
    termsAndCondition: joi.boolean().required()
};


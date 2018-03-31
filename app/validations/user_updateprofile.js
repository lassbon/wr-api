'use strict';

let joi = require('joi');

module.exports = {
    userFirstname: joi.string().required(),
    userLastname: joi.string().required(),
    userPhoneNumber: joi.string().required(),
   // userEmail: joi.string().email().required(),
    userAccountNumber: joi.string().required(),
    password: joi.string().required(),
    userBVN: joi.string().required()
};


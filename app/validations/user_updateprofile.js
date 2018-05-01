'use strict';

let joi = require('joi');

const schema = joi.object().keys({
    userFirstname: joi.string(),
    userLastname: joi.string(),
    userPhoneNumber: joi.string(),
    userAccountNumber: joi.string(),
    password: joi.string(),
    userBVN: joi.string()

    // At least ONE of these parameters must be sent
}).or('userFirstname', 'userLastname', 'userOthername', 'userAddress', 'userAccountNumber', 'password', 'userBVN');

module.exports = schema;


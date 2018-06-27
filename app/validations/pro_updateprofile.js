'use strict';

let joi = require('joi');

const schema = joi.object().keys({
    proFirstname: joi.string(),
    proLastname: joi.string(),
    proPhoneNumber: joi.string(),
    proAccountNumber: joi.string(),
    password: joi.string(),
    proBVN: joi.string()

    // At least ONE of these parameters must be sent
}).or('proFirstname', 'proLastname', 'proOthername', 'proAddress', 'proAccountNumber', 'password', 'proBVN');

module.exports = schema;


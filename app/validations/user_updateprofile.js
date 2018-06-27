'use strict';

let joi = require('joi');

const schema = joi.object().keys({
    firstname: joi.string(),
    lastname: joi.string(),
    phone: joi.string(),
    account_number: joi.string(),
    account_name: joi.string(),
    password: joi.string(),
    bvn: joi.string()

    // At least ONE of these parameters must be sent
}).or('firstname', 'lastname', 'othername', 'address', 'account_number', 'account_name', 'password', 'bvn');

module.exports = schema;


'use strict';

let joi = require('joi');

const schema = joi.object().keys({
    userPhoneNumber: joi.string().min(11).max(14)

    // At least ONE of these parameters must be sent
}).or('userPhoneNumber');

module.exports = schema;


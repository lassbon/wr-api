'use strict';

let joi = require('joi');

module.exports = {
    body: {
        email: joi.string().required(),
        password: joi.string().required()
    },
    socialauth: {
        email: joi.string().required(),
        password: joi.string(),
        firstname: joi.string(),
        lastname: joi.string(),
        address: joi.string(),
        phone: joi.string().required(),
        is_facebook: joi.boolean(),
        is_twitter: joi.boolean(),
        is_google: joi.boolean(),
        account_number: joi.string(),
        password: joi.string(),
        bvn: joi.string()
    },
    params: {
        type: joi.string().required()
    }
};

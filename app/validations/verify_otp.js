'use strict';

let joi = require('joi');

module.exports = {
    body: {
        otp: joi.string().required()
    },
    query: {
        id: joi.number().integer().required()
    }
};

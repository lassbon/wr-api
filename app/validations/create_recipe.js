'use strict';

let joi = require('joi');

module.exports = {
    name: joi.string().required(),
    prep_time: joi.number().integer().positive().required(),
    difficulty: joi.number().integer().min(1).max(3).required(),
    vegetarian: joi.boolean().required()
};

'use strict';

let joi = require('joi');

module.exports = {
    params: {
        id: joi.number().integer().positive().required()
    },
    body: {
        name: joi.string().optional(),
        prep_time: joi.number().integer().positive().optional(),
        difficulty: joi.number().integer().min(1).max(3).optional(),
        vegetarian: joi.boolean().optional()
    }
};

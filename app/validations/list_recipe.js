'use strict';

let joi = require('joi');

module.exports = {
    name: joi.string().optional(),
    prep_time: joi.number().integer().positive().optional(),
    difficulty: joi.number().integer().min(1).max(3).optional(),
    vegetarian: joi.boolean().optional(),
    offset: joi.number().integer().min(0).optional(),
    limit: joi.number().integer().positive().optional()
};

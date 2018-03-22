'use strict';

let joi = require('joi');

module.exports = {
    params: {
        id: joi.number().integer().positive().required()
    },
    body: {
        rating: joi.number().min(1).max(5).precision(2).required(),
        comment: joi.string().optional(),
        rated_by: joi.string().optional()
    }
};

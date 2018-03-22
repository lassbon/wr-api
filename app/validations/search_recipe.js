'use strict';

let joi = require('joi');

module.exports = {
    offset: joi.number().integer().min(0).optional(),
    limit: joi.number().integer().positive().optional()
};

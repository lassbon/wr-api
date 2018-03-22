'use strict';

let joi = require('joi');

module.exports = {
    id: joi.number().integer().positive().required()
};

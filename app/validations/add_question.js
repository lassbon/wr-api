'use strict';

let joi = require('joi');

module.exports = {
    question: joi.string().required(),
    optionA: joi.string().required(),
    optionB: joi.string().required(),
    optionC: joi.string().required(),
    optionD: joi.string().required(),
    answer: joi.string().required()
};

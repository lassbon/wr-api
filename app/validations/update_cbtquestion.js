'use strict';

let joi = require('joi');

const schema = joi.object().keys({
    question: joi.string(),
    optionA: joi.string(),
    optionB: joi.string(),
    optionC: joi.string(),
    optionD: joi.string(),
    answer: joi.string()

    // At least ONE of these parameters must be sent
}).or('question', 'optionA', 'optionB', 'optionC', 'optionD', 'answer');

module.exports = schema;


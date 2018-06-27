'use strict';

let joi = require('joi');

module.exports = {
  body: {
    firstname: joi.string().required(),
    lastname: joi.string().required(),
    address: joi.string().required(),
    phone: joi.string().required(),
    email: joi.string().email().required(),
    account_number: joi.string().required(),
    password: joi.string().required(),
    bvn: joi.string().required()
  },
  params: {
    type: joi.string().required()
  }
};



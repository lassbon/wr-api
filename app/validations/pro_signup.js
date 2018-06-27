'use strict';

let joi = require('joi');

module.exports = {
    proFirstname: joi.string().required(),
    proLastname: joi.string().required(),
    proAddress: joi.string().required(),
  //  userEmail: joi.string().email().required(),
   // userAccountNumber: joi.string().required(),
    password: joi.string().required(),
  //  userBVN: joi.string().required()
};



'use strict';

let joi = require('joi');

const schema = joi.object().keys({
    invitedByReferralCode: joi.string(),
    referralCode: joi.string()
    // At least ONE of these parameters must be sent
}).or('invitedByReferralCode');

module.exports = schema;


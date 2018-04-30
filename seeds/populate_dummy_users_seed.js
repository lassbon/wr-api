'use strict';

let userService = require('app/services/account');
let config = require('app/config/config');

exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('user').del()
      .then(function () {
        // Inserts seed entries
        return knex('user').insert([
            {
                id: 1, 
                userFirstname: config.apiTestUser.userFirstname,
                userLastname: config.apiTestUser.userLastname,
                userOthername: config.apiTestUser.userOthername,
                userPhoneNumber: config.apiTestUser.userPhoneNumber,
                userAddress: config.apiTestUser.userAddress,
                userEmail: config.apiTestUser.userEmail,
                userDOB: config.apiTestUser.userDOB,
                country: config.apiTestUser.country,
                state: config.apiTestUser.state,
                userImageURL: config.apiTestUser.userImageURL,
                userAccountNumber: config.apiTestUser.userAccountNumber,
                userAccountName: config.apiTestUser.userAccountName,
                userBVN: config.apiTestUser.userBVN,
                termsAndCondition: config.apiTestUser.termsAndCondition,
                isApproved: config.apiTestUser.isApproved,
                isFacebook: config.apiTestUser.isFacebook,
                isTwitter: config.apiTestUser.isTwitter,
                isGoogle: config.apiTestUser.isGoogle,
                userStatus: config.apiTestUser.userStatus,
                referralCode: config.apiTestUser.referralCode,
                invitedByReferralCode: config.apiTestUser.invitedByReferralCode,
                password: userService.encryptPassword(config.apiTestUser.password),
                created_at: new Date()
            }
        ]);
    });
};

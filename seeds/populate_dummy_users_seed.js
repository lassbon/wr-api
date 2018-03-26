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
                userFirstname: config.userFirstname,
                userLastname: config.userLastname,
                userOthername: config.userOthername,
                userPhoneNumber: config.userPhoneNumber,
                userAddress: config.userAddress,
                userEmail: config.userEmail,
                userDOB: config.userDOB,
                country: config.country,
                state: config.state,
                userImageURL: config.userImageURL,
                userAccountNumber: config.userAccountNumber,
                userAccountName: config.userAccountName,
                userBVN: config.userBVN,
                termsAndCondition: config.termsAndCondition,
                isApproved: config.isApproved,
                isFacebook: config.isFacebook,
                isTwitter: config.isTwitter,
                isGoogle: config.isGoogle,
                password: userService.encryptPassword(config.apiTestUser.password),
                created_at: new Date()
            }
        ]);
    });
};

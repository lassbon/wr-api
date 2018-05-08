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
                user_id: "WR/test",
                firstname: config.apiTestUser.userFirstname,
                lastname: config.apiTestUser.userLastname,
                othername: config.apiTestUser.userOthername,
                phone: config.apiTestUser.userPhoneNumber,
                address: config.apiTestUser.userAddress,
                email: config.apiTestUser.userEmail,
                dob: config.apiTestUser.userDOB,
                country: config.apiTestUser.country,
                state: config.apiTestUser.state,
                image_url: config.apiTestUser.userImageURL,
                account_number: config.apiTestUser.userAccountNumber,
                account_name: config.apiTestUser.userAccountName,
                bvn: config.apiTestUser.userBVN,
                terms: config.apiTestUser.termsAndCondition,
                is_approved: config.apiTestUser.isApproved,
                is_facebook: config.apiTestUser.isFacebook,
                is_twitter: config.apiTestUser.isTwitter,
                is_google: config.apiTestUser.isGoogle,
                status: config.apiTestUser.userStatus,
                user_type_id: 1,
                referral_code: config.apiTestUser.referralCode,
                is_referral_invite: config.apiTestUser.invitedByReferralCode,
                password: userService.encryptPassword(config.apiTestUser.password),
                created_at: new Date()
            }
        ]);
    });
};

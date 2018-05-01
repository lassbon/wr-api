'use strict';

exports.up = function (knex) {
    return knex.schema
        .createTableIfNotExists('user', function (table) {
            table.bigincrements('id').primary();
            table.string('userID');
            table.string('userFirstname');
            table.string('userLastname');
            table.string('userOthername');
            table.string('userPhoneNumber');
            table.string('userAddress');
            table.string('userEmail').notNullable().unique();
            table.string('userDOB');
            table.string('country');
            table.string('state');
            table.string('userImageURL');
            table.integer('userAccountNumber');
            table.string('userAccountName');
            table.integer('userBVN');
            table.boolean('termsAndCondition');
            table.boolean('isApproved');
            table.boolean('isFacebook');
            table.boolean('isTwitter');
            table.boolean('isGoogle');
            table.string('userStatus');
            table.string('referralCode');
            table.string('invitedByReferralCode');
            table.string('password');
            table.timestamps(true, true);
        });
};

exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists('user');
};

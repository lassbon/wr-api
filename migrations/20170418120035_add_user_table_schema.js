'use strict';

exports.up = function (knex) {
    return knex.schema
        .createTableIfNotExists('user', function (table) {
            table.bigincrements('id').primary();
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
            table.string('userAccountNumber');
            table.string('userAccountName');
            table.string('userBVN');
            table.string('termsAndCondition');
            table.string('isApproved');
            table.string('isFacebook');
            table.string('isTwitter');
            table.string('isGoogle');
            table.string('password');
            table.timestamps();
        });
};

exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists('user');
};

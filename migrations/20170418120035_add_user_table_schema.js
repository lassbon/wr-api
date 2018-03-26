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
            table.integer('userAccountName');
            table.string('userBVN');
            table.boolean('termsAndCondition');
            table.boolean('isApproved');
            table.boolean('isFacebook');
            table.boolean('isTwitter');
            table.boolean('isGoogle');
            table.string('password');
            table.timestamp('created_at').defaultTo(knex.fn.now())
        });
};

exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists('user');
};

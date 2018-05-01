'use strict';

exports.up = function (knex) {
    return knex.schema
        .createTableIfNotExists('pro', function (table) {
            table.bigincrements('id').primary();
            table.string('proID');
            table.string('proFirstname');
            table.string('proLastname');
            table.string('proOthername');
            table.string('proPhoneNumber');
            table.string('proAddress');
            table.string('proEmail').notNullable().unique();
            table.string('proDOB');
            table.string('country');
            table.string('state');
            table.string('proImageURL');
            table.integer('proAccountNumber');
            table.string('proAccountName');
            table.integer('proBVN');
            table.boolean('termsAndCondition');
            table.boolean('isApproved');
            table.boolean('isFacebook');
            table.string('proStatus');
            table.string('referralCode');
            table.string('invitedByReferralCode');
            table.string('password');
            table.timestamps(true, true);
        });
};

exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists('pro');
};

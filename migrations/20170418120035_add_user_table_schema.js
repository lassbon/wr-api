'use strict';

exports.up = function (knex) {
    return knex.schema
        .createTableIfNotExists('user_type', function (table) {
            table.bigincrements('id').primary();
            table.string('name');
            table.timestamps(true, true);
        })
        .createTableIfNotExists('users', function (table) {
            table.bigincrements('id').primary();
            table.string('user_id');
            table.string('firstname');
            table.string('lastname');
            table.string('othername');
            table.string('phone').notNullable().unique();
            table.string('address');
            table.string('email').notNullable().unique();
            table.string('dob');
            table.string('country');
            table.string('state');
            table.string('image_url');
            table.integer('account_number');
            table.string('account_name');
            table.integer('bvn');
            table.boolean('terms');
            table.boolean('is_approved').defaultTo(false);
            table.boolean('is_activated').defaultTo(false);
            table.boolean('is_facebook').defaultTo(false);
            table.boolean('is_twitter').defaultTo(false);
            table.boolean('is_google').defaultTo(false);
            table.string('status');
            table.biginteger('usertype_id').unsigned().notNullable().references('id').inTable('user_type').index();
            table.string('referral_code');
            table.string('is_referral_invite');
            table.string('password');
            table.string('otp');
            table.timestamps(true, true);
        });
};

exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists('users')
        .dropTableIfExists('user_type');
};

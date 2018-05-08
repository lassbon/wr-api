'use strict';

exports.up = function (knex) {
    return knex.schema
        .createTableIfNotExists('user', function (table) {
            table.bigincrements('id').primary();
            table.string('user_id');
            table.string('firstname');
            table.string('lastname');
            table.string('othername');
            table.string('phone');
            table.string('address');
            table.string('emal').notNullable().unique();
            table.string('dob');
            table.string('country');
            table.string('state');
            table.string('image_url');
            table.integer('account_number');
            table.string('account_name');
            table.integer('bvn');
            table.boolean('terms');
            table.boolean('is_approved');
            table.boolean('is_facebook');
            table.boolean('is_twitter');
            table.boolean('is_google');
            table.string('status');
            table.integer('user_type_id');
            table.string('referral_code');
            table.string('is_referral_invite');
            table.string('password');
            table.timestamps(true, true);
        });
};

exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists('user');
};

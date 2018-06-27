'use strict';

exports.up = function (knex) {
    return knex.schema
        .createTableIfNotExists('user', function (table) {
            table.bigincrements('id').primary();
            table.string('full_name');
            table.string('email').notNullable().unique();
            table.string('password');
            table.timestamps();
        });
};

exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists('user');
};

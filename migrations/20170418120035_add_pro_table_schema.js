'use strict';

exports.up = function (knex) {
    return knex.schema
        .createTableIfNotExists('user_type', function (table) {
            table.bigincrements('id').primary();
            table.string('name');
            table.timestamps(true, true);
        });
};

exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists('pro');
};

'use strict';

exports.up = function (knex) {
    return knex.schema
        .createTableIfNotExists('professions', function (table) {
            table.bigincrements('id').primary();
            table.string('professions_id');
            table.string('professions');
            table.timestamps(true, true);
        });
};

exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists('professions');
};

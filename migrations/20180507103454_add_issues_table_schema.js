'use strict';

exports.up = function (knex) {
    return knex.schema
        .createTableIfNotExists('issues', function (table) {
            table.bigincrements('id').primary();
            table.string('issues_id');
            table.string('professions_id');
            table.timestamps(true, true);
        });
};

exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists('issues');
};

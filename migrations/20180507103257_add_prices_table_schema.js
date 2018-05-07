'use strict';

exports.up = function (knex) {
    return knex.schema
        .createTableIfNotExists('prices', function (table) {
            table.bigincrements('id').primary();
            table.string('prices_id');
            table.string('issues_id');
            table.string('prices');
            table.timestamps(true, true);
        });
};

exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists('prices');
};

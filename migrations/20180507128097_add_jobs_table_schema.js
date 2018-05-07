'use strict';

exports.up = function (knex) {
    return knex.schema
        .createTableIfNotExists('jobs', function (table) {
            table.bigincrements('id').primary();
            table.string('bookings_id');
            table.string('job'); //cancel, ongoing, done
            table.timestamps(true, true);
        });
};

exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists('jobs');
};

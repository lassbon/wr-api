'use strict';

exports.up = function (knex) {
    return knex.schema
        .createTableIfNotExists('bookings', function (table) {
            table.bigincrements('id').primary();
            table.string('bookings_id');
            table.string('bookings_type'); //instant or schedule
            table.string('professions_id');
            table.string('issues_id');
            table.string('bookings_status'); //booked, cancel
            table.string('booking_date');
            table.string('date');
            table.timestamps(true, true);
        });
};

exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists('bookings');
};

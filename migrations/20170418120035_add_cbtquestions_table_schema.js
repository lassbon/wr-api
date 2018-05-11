'use strict';

exports.up = function (knex) {
    return knex.schema
        .createTableIfNotExists('questions', function (table) {
            table.bigincrements('id').primary();
            table.string('question');
            table.string('optionA');
            table.string('optionB');
            table.string('optionC');
            table.string('optionD');
            table.string('answer');
            table.timestamps(true, true);
        });
};

exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists('questions');
};

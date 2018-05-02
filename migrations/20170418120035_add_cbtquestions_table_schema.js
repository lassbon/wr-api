'use strict';

exports.up = function (knex) {
    return knex.schema
        .createTableIfNotExists('cbtquestions', function (table) {
            table.bigincrements('id').primary();
           // table.string('questionID');
            table.string('question');
            table.string('optionA');
            table.string('optionB');
            table.string('optionC');
            table.string('optionD');
            table.string('optionAnswer');
           // table.string('questionID');
            table.timestamps(true, true);
        });
};

exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists('cbtquestions');
};

'use strict';

let bookshelf = require('app/bookshelf');
let errors = require('app/errors');

let Question = bookshelf.Model.extend({
    tableName: 'questions',
    hasTimestamps: true,
    hidden: ['created_at'],

    fetch: function () {
        return bookshelf.Model.prototype.fetch.apply(this, arguments)
            .catch(error => {
                if (error instanceof Question.NotFoundError) {
                    throw new errors.QuestionNotFound('Question not found');
                }
                throw error;
            });
    }

});

module.exports = bookshelf.model('Question', Question);

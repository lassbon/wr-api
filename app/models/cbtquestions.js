'use strict';

let bookshelf = require('app/bookshelf');
let errors = require('app/errors');

let Cbt_questions = bookshelf.Model.extend({
    tableName: 'cbtquestions',
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
    },

    save:  function () {
        return bookshelf.Model.prototype.save.apply(this, arguments)
            .catch(error => {
                if (error.code === 'ER_DUP_ENTRY') {
                    throw new errors.QuestionExists('The Question already exists');
                }

                throw error;
            });
    }

});

module.exports = bookshelf.model('cbt_question', Cbt_questions);

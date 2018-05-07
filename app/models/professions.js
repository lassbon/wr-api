'use strict';

let bookshelf = require('app/bookshelf');
let errors = require('app/errors');

let Professions = bookshelf.Model.extend({
    tableName: 'professions',
    hasTimestamps: true,
    hidden: ['created_at'],

    fetch: function () {
        return bookshelf.Model.prototype.fetch.apply(this, arguments)
            .catch(error => {
                if (error instanceof Professions.NotFoundError) {
                    throw new errors.ProfessionsNotFound('Professions not found');
                }

                throw error;
            });
    },

    save:  function () {
        return bookshelf.Model.prototype.save.apply(this, arguments)
            .catch(error => {
                if (error.code === 'ER_DUP_ENTRY') {
                    throw new errors.ProfessionsExists('The Profession already exists');
                }

                throw error;
            });
    }

});

module.exports = bookshelf.model('Professions', Professions);

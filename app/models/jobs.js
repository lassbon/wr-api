'use strict';

let bookshelf = require('app/bookshelf');
let errors = require('app/errors');

let Prices = bookshelf.Model.extend({
    tableName: 'jobs',
    hasTimestamps: true,
    hidden: ['created_at'],

    fetch: function () {
        return bookshelf.Model.prototype.fetch.apply(this, arguments)
            .catch(error => {
                if (error instanceof Jobs.NotFoundError) {
                    throw new errors.JobsNotFound('There is an error fetching the job update');
                }

                throw error;
            });
    },

    save:  function () {
        return bookshelf.Model.prototype.save.apply(this, arguments)
            .catch(error => {
                if (error.code === 'ER_DUP_ENTRY') {
                    throw new errors.JobsExists('Duplicate Job not allowed');
                }

                throw error;
            });
    }

});

module.exports = bookshelf.model('Jobs', Jobs);

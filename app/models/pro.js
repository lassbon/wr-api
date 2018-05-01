'use strict';

let bookshelf = require('app/bookshelf');
let errors = require('app/errors');

let Pro = bookshelf.Model.extend({
    tableName: 'pro',
    hasTimestamps: true,
    hidden: ['created_at'],

    fetch: function () {
        return bookshelf.Model.prototype.fetch.apply(this, arguments)
            .catch(error => {
                if (error instanceof Pro.NotFoundError) {
                    throw new errors.ProNotFound('Pro not found');
                }

                throw error;
            });
    },

    save:  function () {
        return bookshelf.Model.prototype.save.apply(this, arguments)
            .catch(error => {
                if (error.code === 'ER_DUP_ENTRY') {
                    throw new errors.ProExists('The pro already exists');
                }

                throw error;
            });
    }

});

module.exports = bookshelf.model('Pro', Pro);

'use strict';

let bookshelf = require('app/bookshelf');
let errors = require('app/errors');

let bookings = bookshelf.Model.extend({
    tableName: 'bookings',
    hasTimestamps: true,
    hidden: ['created_at'],

    fetch: function () {
        return bookshelf.Model.prototype.fetch.apply(this, arguments)
            .catch(error => {
                if (error instanceof Bookings.NotFoundError) {
                    throw new errors.BookingsNotFound('Bookings not found');
                }

                throw error;
            });
    },

    save:  function () {
        return bookshelf.Model.prototype.save.apply(this, arguments)
            .catch(error => {
                if (error.code === 'ER_DUP_ENTRY') {
                    throw new errors.BookingsIDExists('The bookings already exists');
                }

                throw error;
            });
    }

});

module.exports = bookshelf.model('bookings', bookings);

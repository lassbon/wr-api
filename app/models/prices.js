'use strict';

let bookshelf = require('app/bookshelf');
let errors = require('app/errors');

let Prices = bookshelf.Model.extend({
    tableName: 'prices',
    hasTimestamps: true,
    hidden: ['created_at'],

    fetch: function () {
        return bookshelf.Model.prototype.fetch.apply(this, arguments)
            .catch(error => {
                if (error instanceof Prices.NotFoundError) {
                    throw new errors.PricesNotFound('Prices not found');
                }

                throw error;
            });
    },

    save:  function () {
        return bookshelf.Model.prototype.save.apply(this, arguments)
            .catch(error => {
                if (error.code === 'ER_DUP_ENTRY') {
                    throw new errors.IssuesExists('The Price already exists');
                }

                throw error;
            });
    }

});

module.exports = bookshelf.model('Prices', Prices);

'use strict';

let bookshelf = require('app/bookshelf');
let errors = require('app/errors');
require('app/models/usertype');

let User = bookshelf.Model.extend({
    tableName: 'users',
    hasTimestamps: true,
    hidden: ['created_at'],

    type: function() {
        return this.hasOne('UserType', 'id', 'usertype_id');
    },

    fetch: function () {
        return bookshelf.Model.prototype.fetch.apply(this, arguments)
            .catch(error => {
                if (error instanceof User.NotFoundError) {
                    throw new errors.UserNotFound('User not found');
                }

                throw error;
            });
    },

    save: function () {
        return bookshelf.Model.prototype.save.apply(this, arguments)
            .catch(error => {
                if (error.code === 'ER_DUP_ENTRY') {
                    throw new errors.UserExists('The user already exists');
                }

                throw error;
            });
    }

});

module.exports = bookshelf.model('User', User);

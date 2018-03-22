'use strict';

let errors = require('app/errors');
let bookshelf = require('app/bookshelf');

require('app/models/recipe_rating');

let Recipe = bookshelf.Model.extend({
    tableName: 'recipe',
    hasTimestamps: true,
    softDelete: true,
    hidden: ['updated_at', 'deleted_at'],

    ratings: function () {
        return this.hasMany('RecipeRating');
    },

    save: function () {
        return bookshelf.Model.prototype.save.apply(this, arguments)
        .catch((error) => {
            if (error.code === '23505') { //unique_violation
                throw new errors.DuplicateRecipeName('Recipe with the same name has already been created');
            }

            throw error;
        });
    },

    fetch: function () {
        return bookshelf.Model.prototype.fetch.apply(this, arguments)
        .catch(error => {
            if (error instanceof Recipe.NotFoundError) {
                throw new errors.RecipeNotFound('Recipe not found');
            }

            throw error;
        });
    },

    destroy: function () {
        return bookshelf.Model.prototype.destroy.apply(this, arguments)
        .catch(error => {
            if (error instanceof Recipe.NoRowsDeletedError) {
                throw new errors.RecipeNotFound('Recipe not found');
            }

            throw error;
        });
    }
});

module.exports = bookshelf.model('Recipe', Recipe);

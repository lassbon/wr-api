'use strict';

let bookshelf = require('app/bookshelf');

let RecipeRating = bookshelf.Model.extend({
    tableName: 'recipe_rating',
    hasTimestamps: true,
    hidden: ['id', 'recipe_id', 'updated_at']

});

module.exports = bookshelf.model('RecipeRating', RecipeRating);

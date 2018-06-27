'use strict';

let userService = require('app/services/account');
let config = require('app/config/config');

exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('user_type').del()
      .then(function () {
        // Inserts seed entries
        return knex('user_type').insert([
            {
                id: 1,
                name: 'user',
                created_at: new Date()
            },
            {
                id: 2,
                name: 'pro',
                created_at: new Date()
            },
            {
                id: 3,
                name: 'admin',
                created_at: new Date()
            }
        ]);
    });
};

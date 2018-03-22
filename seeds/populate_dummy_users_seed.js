'use strict';

let userService = require('app/services/account');
let config = require('app/config/config');

exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('user').del()
      .then(function () {
        // Inserts seed entries
        return knex('user').insert([
            {
                id: 1, full_name: config.apiTestUser.fullName,
                email: config.apiTestUser.userName,
                password: userService.encryptPassword(config.apiTestUser.password),
                created_at: new Date()
            }
        ]);
    });
};

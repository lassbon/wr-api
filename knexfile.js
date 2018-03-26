'use strict';

const config = require('app/config/config');

let dbConfig = {
    client: 'pg',
    connection: config.mysql.connection,
    pool: config.mysql.pool,
    migrations: {
        tableName: 'migrations'
    }
};

/**
 * Database settings.
 *
 * Setting the db settings in knexfile allows me to make use of the migrations & ORM.
 *
 * @type {Object} Database settings
 */
module.exports = {
    production: dbConfig,
    staging: dbConfig,
    development: dbConfig
};

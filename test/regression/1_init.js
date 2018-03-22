'use strict';

let serviceLocator = require('app/config/di');

serviceLocator.register('logger', () => {
    return {
        info: () => {},

        debug: () => {},

        warn: () => {},

        error: () => {},
    };
});

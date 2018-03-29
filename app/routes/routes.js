/**
 @description Setup routes
 **/

'use strict';

let config  = require('app/config/config');

/** Application Routes **/
module.exports.setup = function setup(server, serviceLocator, passport, docs) {
    // let recipe = serviceLocator.get('recipeController');
    let account = serviceLocator.get('accountController');

    // server.get({
    //     path: '/recipes',
    //     name: 'List',
    //     version: ['1.0.0'],
    //     validation: {
    //         params: require('app/validations/list_recipe')
    //     }
    // }, passport.authenticate('jwt', { session: false, failWithError: true }),
    //     (req, res, next) => recipe.list(req, res, next));

    // server.post({
    //     path: '/recipes',
    //     name: 'Create',
    //     version: '1.0.0',
    //     validation: {
    //         body: require('app/validations/create_recipe')
    //     }
    // }, (req, res, next) => recipe.create(req, res, next));

    // server.get({
    //     path: '/recipes/:id',
    //     name: 'Get',
    //     version: '1.0.0',
    //     validation: {
    //         params: require('app/validations/get_recipe')
    //     }
    // }, passport.authenticate('jwt', { session: false, failWithError: true }),
    //     (req, res, next) => recipe.get(req, res, next));

    // server.put({
    //     path: '/recipes/:id',
    //     name: 'Update',
    //     version: '1.0.0',
    //     validation: {
    //         body: require('app/validations/update_recipe').body,
    //         params: require('app/validations/update_recipe').params
    //     }
    // }, (req, res, next) => recipe.update(req, res, next));

    // server.del({
    //     path: '/recipes/:id',
    //     name: 'Delete',
    //     version: '1.0.0',
    //     validation: {
    //         params: require('app/validations/delete_recipe')
    //     }
    // }, (req, res, next) => recipe.delete(req, res, next));

    // server.put({
    //     path: '/recipes/:id/rate',
    //     name: 'Rate',
    //     version: '1.0.0',
    //     validation: {
    //         params: require('app/validations/rate_recipe').params,
    //         body: require('app/validations/rate_recipe').body
    //     }
    // }, passport.authenticate('jwt', { session: false, failWithError: true }),
    //     (req, res, next) => recipe.rate(req, res, next));

    /**
     * Authentication Area
     */
    server.post({
        path: '/login',
        name: 'Login',
        version: '1.0.0',
        validation: {
            body: require('app/validations/login')
        }
    }, (req, res, next) => account.login(req, res, next));

/**
     * User signUp 
     */
    server.post({
        path: '/signup',
        name: 'Signup',
        version: '1.0.0',
        validation: {
            body: require('app/validations/user_signup')
        }
    }, (req, res, next) => account.signup(req, res, next));

/**
     * User profile 
     * get the Users profile
     */
    server.get({
        path: '/profile',
        name: 'Profile',
        version: '1.0.0',
 
    }, (req, res, next) => account.profile(req, res, next));
    
    /**
     * User profile 
     * Update the Users profile

    server.post({
        path: '/profile',
        name: 'Profile',
        version: '1.0.0',
        validation: {
            body: require('app/validations/update_profile')
        }
 
    }, (req, res, next) => account.profile(req, res, next));
    **/

    if (config.environment !== 'production') {

        server.get({
            path: '/api-docs',
            name: 'swagger_docs_v1',
            version: '1.0.0'
        },  (req, res, next) => {
            res.contentType = 'text/plain';
            res.send(docs);
            next();
        });
    }
};

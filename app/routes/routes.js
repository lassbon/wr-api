/**
 @description Setup routes
 **/

'use strict';

let config  = require('app/config/config');

/** Application Routes **/
module.exports.setup = function setup(server, serviceLocator, passport, docs) {
    // let recipe = serviceLocator.get('recipeController');
    let accountController = serviceLocator.get('accountController');
    let questionController = serviceLocator.get('questionController');

    /***************** USER AREA  *****************/

    /**
     * User 
     * Authenticate using basic auth
     */
    server.post({
        path: '/users/login',
        name: 'User Login',
        version: '1.0.0',
        validation: {
            body: require('app/validations/login').body,
            params: require('app/validations/login').params
        }
    }, (req, res, next) => accountController.login(req, res, next));

    /**
     * User
     * Authenticate using social media
     */
    server.post({
        path: '/users/socialauth',
        name: 'User Social Authentication',
        version: '1.0.0',
        validation: {
            body: require('app/validations/login').socialauth,
            params: require('app/validations/login').params
        }
    }, (req, res, next) => accountController.socialauth(req, res, next));
    
    /**
     * User
     * verify OTP
     */
    server.post({
        path: '/users/:id/verify_otp',
        name: 'Verify OTP',
        version: '1.0.0',
        validation: {
            body: require('app/validations/verify_otp').body
        }
    }, (req, res, next) => accountController.verifyOtp(req, res, next));

    server.post({
        path: '/users/signup',
        name: 'User Signup',
        version: '1.0.0',
        validation: {
            body: require('app/validations/user_signup')
        }
    }, (req, res, next) => accountController.signup(req, res, next));

    /**
     * User profile 
     * get the Users profile
     */
    server.get({
        path: '/users/:id',
        name: 'User GetProfile',
        version: '1.0.0',
 
    }, passport.authenticate('jwt', { session: false, failWithError: true }),
    (req, res, next) => accountController.get(req, res, next));

    /**
     * User profile 
     * get the Users profile
     */
    server.get({
        path: '/users',
        name: 'User Profile',
        version: '1.0.0',
 
    }, passport.authenticate('jwt', { session: false, failWithError: true }),
    (req, res, next) => accountController.list(req, res, next));
   
    /**
     * User profile 
     * Update the User's profile
     */
    server.put({
        path: '/users/:id',
        name: 'Update UserProfile',
        version: '1.0.0',
        validation: {
            body: require('app/validations/user_updateprofile')
        }
 
    }, passport.authenticate('jwt', { session: false, failWithError: true }),
    (req, res, next) => accountController.update(req, res, next));
    
    /**
     * Get all users
     */
    server.get({
        path: '/users',
        name: 'GET ALL Users',   
    }, passport.authenticate('jwt', { session: false, failWithError: true }),
    (req, res, next) => accountController.list(req, res, next));


    /***************** ADMIN AREA  *****************/

    /**
     * ADMIN
     * GET
     * Get All CBT questions
    **/
    server.get({
        path: '/questions',
        name: 'Get all questions',   
    }, passport.authenticate('jwt', { session: false, failWithError: true }),
    (req, res, next) => questionController.list(req, res, next));

    /**
     * ADMIN
     * GET
     * Get a question by ID
    **/
    server.get({
        path: '/questions/:id',
        name: 'GET CBT QUESTION',   
    }, passport.authenticate('jwt', { session: false, failWithError: true }),
    (req, res, next) => questionController.get(req, res, next));

    /**
     * 
     * ADMIN
     * POST
     * Add a CBT question
     * 
    **/
    server.post({
        path: '/questions',
        name: 'Add a CBT question',   
        validation: {
            body: require('app/validations/add_question')
        }
    }, passport.authenticate('jwt', { session: false, failWithError: true }),
    (req, res, next) => questionController.add(req, res, next));

    /**
     * ADMIN
     * PUT
     * Edit a question
    **/
    server.put({
        path: '/questions/:id',
        name: 'Edit a question',
        validation:{
            body: require('app/validations/update_question')
        }
    }, passport.authenticate('jwt', { session: false, failWithError: true }),
    (req, res, next) => questionController.update(req, res, next));

    /**
    * Image Upload
    * 
    **/
    server.post({
        path: '/imageupload',
        name: 'Upload Images',
        version: '1.0.0',
        validation: {
        // body: require('app/validations/imageupload')
        }

    }, (req, res, next) => accountController.imageUpload(req, res, next));



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

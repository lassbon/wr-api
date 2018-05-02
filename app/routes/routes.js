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
     * User Area.
     * Contains endpoints that manages users;
     * From authentication to profile edit.
     */
    server.post({
        path: '/users/login',
        name: 'User Login',
        version: '1.0.0',
        validation: {
            body: require('app/validations/login')
        }
    }, (req, res, next) => account.login(req, res, next));

    server.get({
        path: '/users/facebook/login',
        name: 'User Facebook Login',
        version: '1.0.0',
        validation: {
            body: require('app/validations/login')
        }
    }, (req, res, next) => passport.authenticate('facebook'));
    
    server.get({
        path: '/auth/facebook/callback',
        name: 'User Facebook Login',
        version: '1.0.0',
        validation: {
            body: require('app/validations/login')
        }
    }, (req, res, next) => passport.authenticate('facebook', { failureRedirect: '/' }
    ));
    
 
  
    //account.facebooklogin(req, res, next));


   


  
    server.post({
        path: '/users/signup',
        name: 'User Signup',
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
        path: '/users/profile/:id',
        name: 'User GetProfile',
        version: '1.0.0',
 
    }, (req, res, next) => account.profile(req, res, next));


     /**
     * User Referral code 
     * Update the Pro profile
     */
    server.patch({
        path: '/users/referalcode/:id',
        name: 'Users referal code',
        version: '1.0.0',
         validation: {
           // body: require('app/validations/user_updateprofile')
        }
 
    }, (req, res, next) => account.usersReferralCode(req, res, next));
    

   
/**
     * User profile 
     * Update the Users profile
     */
    server.patch({
        path: '/users/profile/:id',
        name: 'user UpdateProfile',
        version: '1.0.0',
         validation: {
            body: require('app/validations/user_updateprofile')
        }
 
    }, (req, res, next) => account.updateProfile(req, res, next));
    


/**
 * PATCH
     * User Referaal Code 
     * Update the Referal code for Users
**/
server.patch({
    path: '/users/referralcode/:id',
    name: 'user Referral Code',
    version: '1.0.0',
    validation:{
        body: require('app/validations/referralcode')
    }
   
}, (req, res, next) => account.usersReferralCode(req, res, next));


     /**
     * Pro Login 
     * Pro Login to get a JWT
     */
    server.post({
        path: '/pro/login',
        name: 'Pro Login',
        version: '1.0.0',
        validation: {
            body: require('app/validations/login')
        }
    }, (req, res, next) => account.prologin(req, res, next));

    
 /**
     * Pro Signup 
     * get the Professionals profile
     */
    server.post({
        path: '/pro/signup',
        name: 'Pro Signup',
        version: '1.0.0',
        validation: {
            body: require('app/validations/pro_signup')
        }
    }, (req, res, next) => account.proSignup(req, res, next));

        
 /**
     * Pro Facebook login 
     * get the Professionals profile
     */
    server.post({
        path: '/pro/facebook/login',
        name: 'Pro Facebook Login',
        version: '1.0.0',
        validation: {
            body: require('app/validations/login')
        }
    }, (req, res, next) => account.proFacebookLogin(req, res, next));


    /**
     * Pro profile 
     * get the Professionals profile
     */
    server.get({
        path: '/pro/profile/:id',
        name: 'Pro getProfile',
        version: '1.0.0',
 
    }, (req, res, next) => account.proProfile(req, res, next));


/**
     * Pro profile 
     * Update the Pro profile
     */
    server.patch({
        path: '/pro/profile/:id',
        name: 'Pro updateProfile',
        version: '1.0.0',
         validation: {
            body: require('app/validations/pro_updateprofile')
        }
 
    }, (req, res, next) => account.updateProProfile(req, res, next));
    

    /**
     * User profile 
     * Update the Users profile
**/
    server.post({
        path: '/otpverification',
        name: 'OTP Verification',
        version: '1.0.0',
        validation: {
            body: require('app/validations/phoneNumber_otp')
        }
 
    }, (req, res, next) => account.otpverfication(req, res, next));
  
/**
 * PATCH
     * Pro Referaal Code 
     * Update the Referal code for Pro
**/
server.patch({
    path: '/pro/referralcode/:id',
    name: 'pro Referral Code',
    version: '1.0.0',
    validation:{
        body: require('app/validations/referralcode')
    }
   
}, (req, res, next) => account.proReferralCode(req, res, next));


/***************** CBT QUESTIONS ROUTE  *****************/

/**ADMIN
 * GET
 *Get All CBT questions
**/
server.get({
    path: '/admin/questions',
    name: 'GET CBT QUESTIONS',   
}, (req, res, next) => account.allcbtquestions(req, res, next));

/**ADMIN
 * GET
 *Get All CBT questions
**/
server.get({
    path: '/admin/question/:id',
    name: 'GET CBT QUESTION',   
}, (req, res, next) => account.cbtquestion(req, res, next));

/**ADMIN
 * GET
 *Get All Pro
**/
server.get({
    path: '/admin/pro/',
    name: 'GET ALL PRO',   
}, (req, res, next) => account.pro(req, res, next));


/**ADMIN
 * GET
 *Get All Users
**/
server.get({
    path: '/admin/users/',
    name: 'GET ALL Users',   
}, (req, res, next) => account.users(req, res, next));


/**ADMIN
 * GET
 *Get a Single Users
**/
server.get({
    path: '/admin/user/:id',
    name: 'GET Single User',   
}, (req, res, next) => account.getuser(req, res, next));




/**ADMIN
 * GET
 *Get Single Pro
**/
server.get({
    path: '/admin/pro/:id',
    name: 'GET PRO',   
}, (req, res, next) => account.getpro(req, res, next));




/**ADMIN
 * POST
 *Add All CBT questions
**/
server.post({
    path: '/admin/question',
    name: 'ADD CBT QUESTION',   
}, (req, res, next) => account.addcbt(req, res, next));


/**ADMIN
 * PATCH
 *EDIT  CBT questions
**/
server.patch({
    path: '/admin/question/:id',
    name: 'Edit CBT QUESTION',
    validation:{
        body: require('app/validations/update_cbtquestion')
    }
}, (req, res, next) => account.editcbt(req, res, next));

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

}, (req, res, next) => account.imageUpload(req, res, next));



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

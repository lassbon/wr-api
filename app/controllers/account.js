'use strict';

let httpStatus = require('http-status');
let errors     = require('app/errors');

class AccountController {

    /**
     * Class constructor
     *
     * @constructor
     * @param accountService - account service instance via dependency injection
     *
     */
    constructor(accountService) {
        this.service = accountService;
    }

    /**
     * Endpoint Post /users/login
     * Login to obtain a jwt
     * @param req
     * @param res
     * @param next
     */
    login(req, res, next) {

        this.service.login(req.body.email, req.body.password)   
        .then((data) => {
            res.send(httpStatus.OK, data);
        })
        .catch((err) => {
            switch (err.constructor){
                case errors.UserNotFound:
                    res.send(httpStatus.UNAUTHORIZED,
                        new errors.Unauthorized('Unauthorized'));
                    break;
                case errors.PasswordMissmatch:
                    res.send(httpStatus.UNAUTHORIZED,
                        new errors.Unauthorized('Unauthorized'));
                    break;
                default:
                    res.send(httpStatus.INTERNAL_SERVER_ERROR,
                        new errors.InternalServerError('Internal Server Error'));
            }
        }).then(next);
    }

    /**
     * Endpoint Post /users/facebook/login
     * Login to obtain a jwt
     * @param req
     * @param res
     * @param next
     */
    facebooklogin(req, res, next) {

        this.service.facebooklogin(req.body.email, req.body.password)   
        .then((data) => {
            res.send(httpStatus.OK, data);
        })
        .catch((err) => {
            switch (err.constructor){
                case errors.UserNotFound:
                    res.send(httpStatus.UNAUTHORIZED,
                        new errors.Unauthorized('Unauthorized'));
                    break;
                case errors.PasswordMissmatch:
                    res.send(httpStatus.UNAUTHORIZED,
                        new errors.Unauthorized('Unauthorized'));
                    break;
                default:
                    res.send(httpStatus.INTERNAL_SERVER_ERROR,
                        new errors.InternalServerError('Internal Server Error'));
            }
        }).then(next);
    }
    

      /**
     * Endpoint Post /users/facebook/login
     * Login to obtain a jwt
     * @param req
     * @param res
     * @param next
     */
    proFacebookLogin(req, res, next) {

        this.service.proFacebookLogin(req.body.email, req.body.password)   
        .then((data) => {
            res.send(httpStatus.OK, data);
        })
        .catch((err) => {
            switch (err.constructor){
                case errors.UserNotFound:
                    res.send(httpStatus.UNAUTHORIZED,
                        new errors.Unauthorized('Unauthorized'));
                    break;
                case errors.PasswordMissmatch:
                    res.send(httpStatus.UNAUTHORIZED,
                        new errors.Unauthorized('Unauthorized'));
                    break;
                default:
                    res.send(httpStatus.INTERNAL_SERVER_ERROR,
                        new errors.InternalServerError('Internal Server Error'));
            }
        }).then(next);
    }


    /**
     * Endpoint Post /pro/login
     * PRO Login to obtain a jwt
     * @param req
     * @param res
     * @param next
     */
    prologin(req, res, next) {

        this.service.prologin(req.body.phoneNumber, req.body.password)   
        .then((data) => {
            res.send(httpStatus.OK, data);
        })
        .catch((err) => {
            switch (err.constructor){
                case errors.ProNotFound:
                    res.send(httpStatus.UNAUTHORIZED,
                        new errors.Unauthorized('Unauthorized'));
                    break;
                case errors.PasswordMissmatch:
                    res.send(httpStatus.UNAUTHORIZED,
                        new errors.Unauthorized('Unauthorized'));
                    break;
                default:
                    res.send(httpStatus.INTERNAL_SERVER_ERROR,
                        new errors.InternalServerError('Internal Server Error'));
            }
        }).then(next);
    }
    /**
     * Endpoint Post /users/signup
     * Signup 
     * @param req
     * @param res
     * @param next
     */
    signup(req, res, next) {

        this.service.signup(req.body)
        .then((data) => {
            res.send(httpStatus.OK, data);
        })
        .catch((error) => {
            switch (error.constructor){
                case errors.UserNotFound:
                case errors.UserExists:
                    res.send(httpStatus.INTERNAL_SERVER_ERROR,
                        new errors.UserExists('The user with the email exists already'));
                    break;
                default:
                    res.send(httpStatus.INTERNAL_SERVER_ERROR,
                        new errors.InternalServerError('Internal Server Error, please check the API logs for details'));
            }
        }).then(next);
    }

        /**
     * Endpoint Post /pro/signup
     * ProSignup 
     * @param req
     * @param res
     * @param next
     */
    proSignup(req, res, next) {

        this.service.proSignup(req.body)
        .then((data) => {
            res.send(httpStatus.OK, data);
        })
        .catch((error) => {
            switch (error.constructor){
                case errors.UserNotFound:
                case errors.UserExists:
                    res.send(httpStatus.INTERNAL_SERVER_ERROR,
                        new errors.UserExists('The pro with the phone exists already'));
                    break;
                default:
                    res.send(httpStatus.INTERNAL_SERVER_ERROR,
                        new errors.InternalServerError('Internal Server Error, please check the API logs for details'));
            }
        }).then(next);
    }

    /**
     * Endpoint GET /users/profile/:id
     * Signup 
     * @param req
     * @param res
     * @param next
     */
    profile(req, res, next) {

        this.service.profile(req.params.id)
        .then((data) => {
            res.send(httpStatus.OK, data);
        })
        .catch((error) => {
            switch (error.constructor){
                case errors.UserNotFound:
                    res.send(httpStatus.INTERNAL_SERVER_ERROR,
                        new errors.UserNotFound('The user with the email does not exists'));
                    break;
                default:
                    res.send(httpStatus.INTERNAL_SERVER_ERROR,
                        new errors.InternalServerError('Internal Server Error, please check the API logs for details'));
            }
        }).then(next);
    }


      /**
     * Endpoint GET /users/profile/:id
     * Signup 
     * @param req
     * @param res
     * @param next
     */
    proProfile(req, res, next) {

        this.service.proProfile(req.params.id)
        .then((data) => {
            res.send(httpStatus.OK, data);
        })
        .catch((error) => {
            switch (error.constructor){
                case errors.ProNotFound:
                    res.send(httpStatus.INTERNAL_SERVER_ERROR,
                        new errors.ProNotFound('The pro with the id does not exists'));
                    break;
                default:
                    res.send(httpStatus.INTERNAL_SERVER_ERROR,
                        new errors.InternalServerError('Internal Server Error, please check the API logs for details'));
            }
        }).then(next);
    }


    /**
     * Endpoint PATCH /users/updateProfile/:id
     * Signup 
     * @param req
     * @param res
     * @param next
     */
    updateProfile(req, res, next) {

        this.service.updateprofile(req.params.id, req.body)
        .then((data) => {
            res.send(httpStatus.OK, data);
        })
        .catch((error) => {
            switch (error.constructor){
                case errors.UserNotFound:
                    res.send(httpStatus.INTERNAL_SERVER_ERROR,
                        new errors.UserNotFound('The user with the email does not exists'));
                    break;
                default:
                    res.send(httpStatus.INTERNAL_SERVER_ERROR,
                        new errors.InternalServerError('Internal Server Error, please check the API logs for details'));
            }
        }).then(next);
    }


     /**
     * Endpoint PATCH /pro/updateProfile/:id
     * Signup 
     * @param req
     * @param res
     * @param next
     */
    updateProProfile(req, res, next) {

        this.service.updateProProfile(req.params.id, req.body)
        .then((data) => {
            res.send(httpStatus.OK, data);
        })
        .catch((error) => {
            switch (error.constructor){
                case errors.UserNotFound:
                    res.send(httpStatus.INTERNAL_SERVER_ERROR,
                        new errors.ProNotFound('The pro with the id does not exists'));
                    break;
                default:
                    res.send(httpStatus.INTERNAL_SERVER_ERROR,
                        new errors.InternalServerError('Internal Server Error, please check the API logs for details'));
            }
        }).then(next);
    }

      /**
     * Endpoint PATCH /users/referralcode/:id
     * Signup 
     * @param req (id)
     * @param res
     * @param next
     */
    usersReferralCode(req, res, next) {
       
        this.service.updateReferralCode(req.params.id, req.body)
        .then((data) => {
            res.send(httpStatus.OK, data);
        })
        .catch((error) => {
            switch (error.constructor){
                case errors.UserNotFound:
                    res.send(httpStatus.INTERNAL_SERVER_ERROR,
                        new errors.UserNotFound('The user with the id does not exists'));
                    break;
                default:
                    res.send(httpStatus.INTERNAL_SERVER_ERROR,
                        new errors.InternalServerError('Internal Server Error, please check the API logs for details'));
            }
        }).then(next);
       
}


      /**
     * Endpoint PATCH /pro/referralcode/:id
     * Referral code 
     * @param req (id)
     * @param res
     * @param next
     */
    proReferralCode(req, res, next) {
       
        this.service.proUpdateReferralCode(req.params.id, req.body)
        .then((data) => {
            res.send(httpStatus.OK, data);
        })
        .catch((error) => {
            switch (error.constructor){
                case errors.UserNotFound:
                    res.send(httpStatus.INTERNAL_SERVER_ERROR,
                        new errors.UserNotFound('The pro with the id does not exists'));
                    break;
                default:
                    res.send(httpStatus.INTERNAL_SERVER_ERROR,
                        new errors.InternalServerError('Internal Server Error, please check the API logs for details'));
            }
        }).then(next);
       
}


    /**
     * Endpoint GET /admin/questions
     * GET ASTIONS 
     * @param req
     * @param res
     * @param next
     */
    allcbtquestions(req, res, next) {

        this.service.allcbtquestions()
        .then((data) => {
            res.send(httpStatus.OK, data);
        })
        .catch((error) => {
            res.send(httpStatus.INTERNAL_SERVER_ERROR,
                new errors.InternalServerError('Internal Server Error, please check the API logs for details'));
    
        }).then(next);
    }


      /**
     * Endpoint GET /admin/pro
     * GET ALL PRO 
     * @param req
     * @param res
     * @param next
     */
    pro(req, res, next) {

        this.service.pro()
        .then((data) => {
            res.send(httpStatus.OK, data);
        })
        .catch((error) => {
            res.send(httpStatus.INTERNAL_SERVER_ERROR,
                new errors.InternalServerError('Internal Server Error, please check the API logs for details'));
    
        }).then(next);
    }


        /**
     * Endpoint GET /admin/pro
     * GET ALL USERS 
     * @param req
     * @param res
     * @param next
     */
    users(req, res, next) {

        this.service.users()
        .then((data) => {
            res.send(httpStatus.OK, data);
        })
        .catch((error) => {
            res.send(httpStatus.INTERNAL_SERVER_ERROR,
                new errors.InternalServerError('Internal Server Error, please check the API logs for details'));
    
        }).then(next);
    }

         /**
     * Endpoint GET /admin/user/:id
     * Signup 
     * @param req
     * @param res
     * @param next
     */
    getuser(req, res, next) {

        this.service.getuser(req.params.id)
        .then((data) => {
            res.send(httpStatus.OK, data);
        })
        .catch((error) => {
            res.send(httpStatus.INTERNAL_SERVER_ERROR,
                new errors.InternalServerError('Internal Server Error, please check the API logs for details'));
    
        }).then(next);
    }

      /**
     * Endpoint GET /admin/pro/:id
     * Signup 
     * @param req
     * @param res
     * @param next
     */
    getpro(req, res, next) {

        this.service.getpro(req.params.id)
        .then((data) => {
            res.send(httpStatus.OK, data);
        })
        .catch((error) => {
            res.send(httpStatus.INTERNAL_SERVER_ERROR,
                new errors.InternalServerError('Internal Server Error, please check the API logs for details'));
    
        }).then(next);
    }


        /**
     * Endpoint GET /admin/cbt/:id
     * Signup 
     * @param req
     * @param res
     * @param next
     */
    getcbt(req, res, next) {

        this.service.cbt()
        .then((data) => {
            res.send(httpStatus.OK, data);
        })
        .catch((error) => {
            res.send(httpStatus.INTERNAL_SERVER_ERROR,
                new errors.InternalServerError('Internal Server Error, please check the API logs for details'));
    
        }).then(next);
    }


        /**
     * Endpoint GET /admin/cbtquestion/:id
     * Signup 
     * @param req
     * @param res
     * @param next
     */
    
    cbtquestion(req, res, next) {

        this.service.cbtquestion(req.params.id)
        .then((data) => {
            res.send(httpStatus.OK, data);
        })
        .catch((error) => {
            res.send(httpStatus.INTERNAL_SERVER_ERROR,
                new errors.InternalServerError('Internal Server Error, please check the API logs for details'));
    
        }).then(next);
    }
    
        /**
     * Endpoint GET /admin/addcbt/
     * Signup 
     * @param req
     * @param res
     * @param next
     */
    addcbt(req, res, next) {

        this.service.addcbt(req.body)
        .then((data) => {
            res.send(httpStatus.OK, data);
        })
        .catch((error) => {
            res.send(httpStatus.INTERNAL_SERVER_ERROR,
                new errors.InternalServerError('Internal Server Error, please check the API logs for details'));
    
        }).then(next);
    }

         /**
     * Endpoint PATCH /pro/updateProfile/:id
     * Signup 
     * @param req
     * @param res
     * @param next
     */
    editcbt(req, res, next) {

        this.service.editcbt(req.params.id, req.body)
        .then((data) => {
            res.send(httpStatus.OK, data);
        })
        .catch((error) => {
            switch (error.constructor){
               /* case errors.UserNotFound:
                    res.send(httpStatus.INTERNAL_SERVER_ERROR,
                        new errors.ProNotFound('The pro with the id does not exists'));
                    break;
                    */
                default:
                    res.send(httpStatus.INTERNAL_SERVER_ERROR,
                        new errors.InternalServerError('Internal Server Error, please check the API logs for details'));
            }
        }).then(next);
    }


    imageUpload(){
        this.service.imageUpload(req.params.id, req.body)
        .then((data) => {
            res.send(httpStatus.OK, data);
        })
        .catch((error) => {
            switch (error.constructor){
               /* case errors.UserNotFound:
                    res.send(httpStatus.INTERNAL_SERVER_ERROR,
                        new errors.ProNotFound('The pro with the id does not exists'));
                    break;
                    */
                default:
                    res.send(httpStatus.INTERNAL_SERVER_ERROR,
                        new errors.InternalServerError('Internal Server Error, please check the API logs for details'));
            }
        }).then(next);

    }

    

    otpverification(){
        this.service.otpverification(req.body)
        .then((data) => {
            res.send(httpStatus.OK, data);
        })
        .catch((error) => {
            switch (error.constructor){
               /* case errors.UserNotFound:
                    res.send(httpStatus.INTERNAL_SERVER_ERROR,
                        new errors.ProNotFound('The pro with the id does not exists'));
                    break;
                    */
                default:
                    res.send(httpStatus.INTERNAL_SERVER_ERROR,
                        new errors.InternalServerError('Internal Server Error, please check the API logs for details'));
            }
        }).then(next);

    }
}

module.exports = AccountController;

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
}

module.exports = AccountController;

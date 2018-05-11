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

        this.service.login(req.body, req.query)   
        .then((data) => {
            res.send(httpStatus.OK, data);
        })
        .catch((err) => {
            switch (err.constructor){
                case errors.UserNotFound:
                    res.send(httpStatus.UNAUTHORIZED,
                        new errors.Unauthorized('Unauthorized'));
                    break;
                case errors.Unauthorized:
                    res.send(httpStatus.UNAUTHORIZED, err);
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
     * Endpoint Post /users/socialauth
     * Login to obtain a jwt
     * @param req
     * @param res
     * @param next
     */
    socialauth(req, res, next) {

        this.service.socialauth(req.body, req.query)   
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
                    res.send(httpStatus.INTERNAL_SERVER_ERROR, err);
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

        this.service.signup(req.body, req.params)
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
     * Endpoint Post /users/:id/verify_otp
     * Verify OTP 
     * @param req
     * @param res
     * @param next
     */
    verifyOtp(req, res, next) {

        this.service.verifyOtp(req.body, req.params)
        .then((data) => {
            res.send(httpStatus.OK, data);
        })
        .catch((error) => {
            switch (error.constructor){
                case errors.UserNotFound:
                    res.send(httpStatus.UNAUTHORIZED,
                        new errors.Unauthorized('Unauthorized'));
                    break;
                case errors.Unauthorized:
                    res.send(httpStatus.UNAUTHORIZED, error);
                    break;
                case errors.PasswordMissmatch:
                    res.send(httpStatus.UNAUTHORIZED,
                        new errors.Unauthorized('Unauthorized'));
                    break;
                case errors.InvalidOtp:
                    res.send(httpStatus.BAD_REQUEST, error);
                    break;
                default:
                    res.send(httpStatus.INTERNAL_SERVER_ERROR,
                        new errors.InternalServerError('Internal Server Error'));
            }
        }).then(next);
    }

    /**
     * Endpoint GET /users/:id
     * Signup 
     * @param req
     * @param res
     * @param next
     */
    get(req, res, next) {

        this.service.findUser(req.params.id)
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
     * Endpoint PUT /users/:id
     * Signup 
     * @param req
     * @param res
     * @param next
     */
    update(req, res, next) {

        this.service.update(req.params.id, req.body)
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
     * Endpoint GET /admin/pro
     * GET ALL USERS 
     * @param req
     * @param res
     * @param next
     */
    list(req, res, next) {

        this.service.list()
        .then((data) => {
            res.send(httpStatus.OK, data);
        })
        .catch((error) => {
            res.send(httpStatus.INTERNAL_SERVER_ERROR,
                new errors.InternalServerError('Internal Server Error, please check the API logs for details'));
    
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
}

module.exports = AccountController;

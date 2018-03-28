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
     * Endpoint Post /login
     * Login to obtain a jwt
     * @param req
     * @param res
     * @param next
     */
    login(req, res, next) {

        this.service.login(req.body.username, req.body.password)
            .then((data) => {
            res.send(httpStatus.OK, data);
        }).catch((err) => {
            switch (err.constructor){
                case errors.UserNotFound:
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
     * Endpoint Post /signup
     * Signup 
     * @param req
     * @param res
     * @param next
     */
    userSignUp(req, res, next) {

        this.service.userSignUp(
                                req.body.userFirstname, 
                                req.body.userLastname,
                                req.body.userOthername,
                                req.body.userPhoneNumber,
                                req.body.userAddress,
                                req.body.userEmail,
                                req.body.userDOB,
                                req.body.country,
                                req.body.state,
                                req.body.userImageURL,
                                req.body.userAccountNumber,
                                req.body.userAccountName,
                                req.body.userBVN,
                                req.body.termsAndCondition,
                                req.body.isApproved,
                                req.body.isFacebook,
                                req.body.isTwitter,
                                req.body.isGoogle,
                                req.body.password

        
        ).then((data) => {
            res.send(httpStatus.OK, data);
        }).catch((err) => {
            switch (err.constructor){
                case errors.UserNotFound:
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

}

module.exports = AccountController;

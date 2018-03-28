'use strict';

let User = require('app/models/user');
let shortid = require('shortid');
let constants = require('app/config/constants');
let config = require('app/config/config');
let errors = require('app/errors');
let bcrypt = require('bcryptjs');
let jwt = require('jsonwebtoken');

class AccountService {

    /**
     * Account service constructor
     *
     * @constructor
     * @param {logger} logger instance of the logger
     */
    constructor(logger) {
        this.logger = logger;
    }

    /**
     * Encrypt Password
     *
     * @param password
     * @returns {?string|string}
     */
    static encryptPassword(password) {
        var salt = bcrypt.genSaltSync(constants.salt_round.DEFAULT);
        return bcrypt.hashSync(password, salt);

    }

    /**
     * Compare a password with an hash
     *
     * @param password
     * @param hash
     * @return {Promise}
     */
    comparePasswords(password, hash) {
        return new Promise((resolve, reject) => {

            bcrypt.compare(password, hash, (err, res) => {
                if (err) {
                    reject(err);
                }

                resolve(res);
            });
        });
    }

    /**
     * Login to obtain a signed jwt
     *
     * @param username
     * @param password
     * @returns {Promise.<TResult>}
     */

    login(username, password) {
        let reqId = shortid.generate();
        this.logger.info(`Request ID: ${reqId} - Retrieve a user with username: ${username}`);

        return new User({ userEmail: username })
            .fetch({ require: true })
            .then(user => {

                this.logger.info(`Request ID: ${reqId} - Retrieved user `, user);

                return this.comparePasswords(password, user.get('password')).then((match) => {
                    if (!match) {

                        throw new errors.PasswordMissmatch('Wrong password supplied');
                    }

                    let payload = { id: user.id }; //only expose user-id in token

                    return { token: jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn }) };

                });
            }).catch(error => {

                this.logger.error(`Request ID: ${reqId} - Error retrieving user with username ${username}, 
                reason: ${error.message}`);
                throw error;
            });
    }






    /**
     * SignUp
     *
     * @param username
     * @param password
     * @returns {Promise.<TResult>}
     */

    userSignUp(userFirstname, userLastname, userOthername, userPhoneNumber,  userAddress, userEmail,
        userDOB, country, state, userImageURL, userAccountNumber, userAccountName, userBVN, termsAndCondition,
        password, confirmPassword) {

        let reqId = shortid.generate();
        this.logger.info(`Request ID: ${reqId} - Retrieve a user with username: ${username}`);
      
        if (req.body.password !== req.body.confirmPassword) {

            this.logger.error(`Request ID: ${reqId} - comparing password for use ${email}, 
                reason: ${error.message}`);    
            return res.json(401, {
              status: "Error",
              err: "Passwords doesn't match.."
            });
          }

         new User({ userFirstname: userFirstname,
                          userLastname: userLastname,
                          userOthername: userOthername,
                          userPhoneNumber: userPhoneNumber,
                          userAddress: userAddress,
                          userEmail: userEmail,
                          userDOB: userDOB,
                          country: country,
                          state: country,
                          userImageURL: userImageURL,
                          userAccountNumber: userAccountNumber,
                          userAccountName: userAccountName,
                          userBVN: userBVN,
                          termsAndCondition: termsAndCondition

                         })
            .then(user => {

                this.logger.info(`Request ID: ${reqId} - Retrieved user `, user);

                return "account created"
            }).catch(error => {

                this.logger.error(`Request ID: ${reqId} - Error retrieving user with username ${username}, 
                reason: ${error.message}`);
                throw error;
            });
    }


    /**
     * Find user
     *
     * @param id the pk of the user
     * @returns {Promise.<TResult>}
     */

    findUser(id) {
        let reqId = shortid.generate();
        this.logger.info(`Request ID: ${reqId} - Retrieve a user with id: ${id}`);

        return new User({ id: id })
            .fetch({ require: true })
            .then(user => {
                delete user.attributes.password; //never return the user's password

                this.logger.info(`Request ID: ${reqId} - Retrieved user `, user);

                return user;
            }).catch(error => {

                //tell the developer what went wrong
                this.logger.error(`Request ID: ${reqId} - Error retrieving user with id ${id},
                 reason: ${error.message}`);
                throw error;
            });
    }

}

module.exports = AccountService;

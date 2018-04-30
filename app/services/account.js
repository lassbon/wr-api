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
     * @param email
     * @param password
     * @returns {Promise.<TResult>}
     */

    login(email, password) {
        let reqId = shortid.generate();
        this.logger.info(`Request ID: ${reqId} - Retrieve a user with email: ${email}`);

        return new User({ userEmail: email })
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

                this.logger.error(`Request ID: ${reqId} - Error retrieving user with email ${email}, 
                reason: ${error.message}`);
                throw error;
            });
    }

      /**
     * Pro Login to obtain a signed jwt
     *
     * @param email
     * @param password
     * @returns {Promise.<TResult>}
     */

    login(email, password) {
        let reqId = shortid.generate();
        this.logger.info(`Request ID: ${reqId} - Retrieve a professional with email: ${email}`);

        return new User({ userEmail: email })
            .fetch({ require: true })
            .then(user => {

                this.logger.info(`Request ID: ${reqId} - Retrieved pro `, user);

                return this.comparePasswords(password, user.get('password')).then((match) => {
                    if (!match) {

                        throw new errors.PasswordMissmatch('Wrong password supplied');
                    }

                    let payload = { id: user.id }; //only expose user-id in token

                    return { token: jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn }) };

                });
            }).catch(error => {

                this.logger.error(`Request ID: ${reqId} - Error retrieving user with email ${email}, 
                reason: ${error.message}`);
                throw error;
            });
    }


    /**
     * Facebook Login 
     *
     * @param email
     * @param password
     * @returns {Promise.<TResult>}
     */

    facebooklogin(username, password) {
    

        
    }

    /**
     * SignUp
     *
     * @param userData
     * @returns {Promise.<TResult>}
     */
    signup(userData) {

        let reqId = shortid.generate();
        this.logger.info(`Request ID: ${reqId} - Creating a user with data: ${JSON.stringify(userData)}`);

        let data = userData;
        data.password = this.constructor.encryptPassword(data.password);
        data.referralCode = this.generateReferralCode();

        return new User().save(data)
            .then((user) => {
                this.logger.info(`Request ID: ${reqId} - User created `, JSON.stringify(user));
                delete user.attributes.password;
                
                return user;
            }).catch((error) => {

                this.logger.error(`Request ID: ${reqId} - Error creating user with data ${JSON.stringify(userData)}, 
                reason: ${error.message}`);
                throw error;
            });
    }
    /**
     * Profile
     *
     * @param email
     * @returns {Promise.<TResult>}
     */
    profile(email) {

        let reqId = shortid.generate();
        this.logger.info(`Request ID: ${reqId} - Retrieve a user with email: ${email}`);

        return new User({ userEmail: email })
       .fetch({ require: true })
       .then(user => {

           this.logger.info(`Request ID: ${reqId} - Retrieved user `, user);
           return user;
       }).catch(error => {

           this.logger.error(`Request ID: ${reqId} - Error retrieving user with email ${email}, 
           reason: ${error.message}`);
           throw error;
       });
    }


    /**
     * Find user by ID
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

    /**
     * Find user by email
     *
     * @param id the pk of the user
     * @returns {Promise.<TResult>}
     */

    findUserByEmail(email) {
        this.logger.info(`Retrieving a user with email: ${email}`);

        return new User({ userEmail: email })
            .fetch({ require: true })
            .then(user => {
                delete user.attributes.password; //never return the user's password

                this.logger.info(`Retrieved user `, JSON.stringify(user));

                return user;
            }).catch(error => {

                //tell the developer what went wrong
                this.logger.error(`Error retrieving user with email ${email},
                 reason: ${error.message}`);
                throw error;
            });
    }
    /**
     * Format Phone Number
     *
     * @param phoneNumber
     * @returns formatted phoneNumber
     */

    formatPhoneNumber(phoneNumber) 
    {
       var  raw_phoneNumber = phoneNumber.substr(0,1);
       if (raw_phoneNumber == 0 ) 
        {
            internationalPrefix = "+234";     
            num10Digits = phoneNumber.substr(1);//remove leading zero in phonenumer               
            fullNumber = internationalPrefix . num10Digits;  //concatenate with +234
            
            return fullNumber;

         } 
         else 
             if (substr(phoneNumber, 1, 3) == '234') 
         {
            //substr('abcdef', 0, 4);  // abcd
            fullNumber = phoneNumber;
            return fullNumber;
        }
        else 
        {
             return phoneNumber;  //return "Wrong Number Format"  
        }
        
    }

 /**
     * Genrate Referral Code
     *
     * @returns code
     */

    generateReferralCode() 
    {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      
        for (var i = 0; i < 5; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));
      
        return text;
       
     }
        


}

module.exports = AccountService;

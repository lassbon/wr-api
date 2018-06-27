'use strict';

let User = require('app/models/user');
let UserType = require('app/models/usertype');
let shortid = require('shortid');
var shortIdGen = require('short-id-gen');
let constants = require('app/config/constants');
let config = require('app/config/config');
let errors = require('app/errors');
let bcrypt = require('bcryptjs');
let jwt = require('jsonwebtoken');
let ResourceService = require('app/services/resource');

class AccountService extends ResourceService {

    /**
     * Account service constructor
     *
     * @constructor
     * @param {logger} logger instance of the logger
     * @param {logger} logger instance of the notification library
     */
    constructor(logger, notificationLib) {
        super(logger, notificationLib)
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
     * Compare user types
     *
     * @param expectedType
     * @param typeToCheck
     * @param user
     * @return {Promise}
     */
    compareUserTypes(expectedType, typeToCheck, user) {
        return new Promise((resolve, reject) => {

            if (expectedType === typeToCheck) {
                resolve(user);
            } else {
                reject(new errors.Unauthorized(`The user is not a/an ${expectedType} user`));
            }
        });
    }

    /**
     * Compare user types
     *
     * @param expectedOtp
     * @param otpToCheck
     * @param user
     * @return {Promise}
     */
    compareUserOtp(expectedOtp, otpToCheck) {
        this.logger.info(`Request ID: Checking OTP validity`);
        return new Promise((resolve, reject) => {

            if (expectedOtp === otpToCheck) {
                resolve(true);
            } else {
                reject(new errors.InvalidOtp(`The OTP ${otpToCheck} is Invalid`));
            }
        });
    }

    /**
     * Login to obtain a signed jwt
     *
     * @param email
     * @param password
     * @returns {Promise.<TResult>}
     */

    login(data, params) {
        let reqId = shortid.generate();
        this.logger.info(`Request ID: ${reqId} - Going to retrieve a user with data: ${JSON.stringify(data)}`);
        // Create query based on the data sent (if it contains phone or not)
        let query;
        if (params.type === constants.userTypes.pro) {
            query = data.phone ? {where: { phone: this.formatPhoneNumber(data.phone), is_activated: true, is_approved: true } } : 
            {where: { email: data.email, is_activated: true, is_approved: true }};
        } else {
            query = data.phone ? { where: { phone: this.formatPhoneNumber(data.phone), is_activated: true } } : 
            { where: { email: data.email, is_activated: true } };
        }
        this.logger.info(`Request ID: ${reqId} - Query being used for retrieval: ${JSON.stringify(query)}`);

        return User.query(query)
            .fetch({ require: true, withRelated: ['type'] })
            .then((user) => {

                this.logger.info(`Request ID: ${reqId} - Retrieved user `, JSON.stringify(user));
                let type = user.related('type').toJSON();

                return this.compareUserTypes(params.type, type.name, user);
            })
            .then((user) => {
                return this.comparePasswords(data.password, user.get('password')).then((match) => {
                    if (!match) {

                        throw new errors.PasswordMissmatch('Wrong password supplied');
                    }

                    let payload = { id: user.id, type: user.related('type') }; //only expose user-id and type in token

                    return { token: jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn }) };

                });
            })
            .catch(error => {

                this.logger.error(`Request ID: ${reqId} - Error retrieving user with data ${JSON.stringify(data)}, 
                reason: ${error.message}`);
                throw error;
            });
    }

    /**
     * Verify an OTP
     *
     * @param data
     * @param params
     * @returns {Promise.<TResult>}
     */
    verifyOtp(data, params) {
        let reqId = shortid.generate();
        this.logger.info(`Request ID: ${reqId} - Going to retrieve a user with data: ${JSON.stringify(data)}`);
        // Create query based on the data sent (if it contains phone or not)
        let query = {where: { id: params.id } };
        this.logger.info(`Request ID: ${reqId} - Query being used for retrieval: ${JSON.stringify(query)}`);

        return User.query(query)
            .fetch({ require: true })
            .then((user) => {
                this.logger.info(`Request ID: ${reqId} - Retrieved user ${JSON.stringify(user)} Verifying OTP...`);
                return this.compareUserOtp(user.get('otp'), data.otp);
            })
            .then((user) => {
                this.logger.info(`Request ID: ${reqId} - The OTP is valid, going to update user to active`);
                return User.where({ id: params.id }).save({ is_activated: true }, { patch:true })
            })
            .then((user) => {
                this.logger.info(`Request ID: ${reqId} - User activated!`);
                return 'OTP valid, and user activated';
            })
            .catch((error) => {
                this.logger.error(`Request ID: ${reqId} - Error validating OTP ${JSON.stringify(data)}, reason: ${error.message}`);
                throw error;
            });
    }

    /**
     * Login to obtain a signed jwt
     *
     * @param data
     * @param params
     * @returns {Promise.<TResult>}
     */
    socialauth(data, params) {
        let reqId = shortid.generate();
        this.logger.info(`Request ID: ${reqId} - Creating a user using socialauth with data: ${JSON.stringify(data)}`);

        data.referral_code = this.generateReferralCode();
        data.user_id = this.generateUserID(params.type);
        return new UserType({name: params.type}).fetch({ require: true})
            .then((usertype) => {
                this.logger.info(`Request ID: ${reqId} - Found User type: ${JSON.stringify(usertype)}`);
                data.usertype_id = usertype.id;
                return new User().save(data);
            })
            .then((user) => {
                this.logger.info(`Request ID: ${reqId} - User created `, JSON.stringify(user));
                delete user.attributes.password;
                
                return user;
            })
            .catch((error) => {
                this.logger.error(`Request ID: ${reqId} - Error creating user using socialauth with data ${JSON.stringify(data)}, 
                reason: ${error.message}`);

                switch (error.constructor){
                    case errors.UserExists:
                        this.logger.info(`Request ID: ${reqId} - Going to retrieve a user with data: ${JSON.stringify(data)}`);
                        // Create query based on the data sent (if it contains phone or not)
                        let query = data.phone ? {where: { phone: this.formatPhoneNumber(data.phone) } } : {where: { email: data.email }};
                        this.logger.info(`Request ID: ${reqId} - Query being used for retrieval: ${JSON.stringify(query)}`);
                
                        return User.query(query)
                            .fetch({ require: true, withRelated: ['type'] })
                            .then((user) => {
                
                                this.logger.info(`Request ID: ${reqId} - Retrieved user `, JSON.stringify(user));
                                let type = user.related('type').toJSON();
                
                                return this.compareUserTypes(params.type, type.name, user);
                            })
                            .then((user) => {
                                let payload = { id: user.id, type: user.related('type') }; //only expose user-id and type in token
                
                                return { token: jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn }) };
                            })
                            .catch(error => {
                
                                this.logger.error(`Request ID: ${reqId} - Error returning user with data ${JSON.stringify(data)}, 
                                reason: ${error.message}`);
                                throw error;
                            });
                        break;
                    default:
                        throw error;
                }
            });
    }

    /**
     * SignUp
     *
     * @param userData
     * @returns {Promise.<TResult>}
     */
    signup(userData, params) {

        let reqId = shortid.generate();
        this.logger.info(`Request ID: ${reqId} - Creating a user with data: ${JSON.stringify(userData)}`);

        let data = userData;
        data.password = this.constructor.encryptPassword(data.password);
        data.referral_code = this.generateReferralCode();
        data.user_id = this.generateUserID(params.type);
        data.phone = this.formatPhoneNumber(data.phone);
        data.otp = shortIdGen.generate(6);

        return new UserType({name: params.type}).fetch({ require: true})
            .then((usertype) => {
                this.logger.info(`Request ID: ${reqId} - Found User type: ${JSON.stringify(usertype)}`);
                data.usertype_id = usertype.id;
                return new User().save(data);
            })
            .then((user) => {
                this.logger.info(`Request ID: ${reqId} - User created `, JSON.stringify(user));
                delete user.attributes.password;
                let OtpMessage = `Hello from workraven. Here's your OTP ${user.get('otp')}`
                return this.notification.sendSms(user.get('phone'), OtpMessage);
            })
            .then((message) => {
                return 'OTP sent successfully';
            })
            .catch((error) => {

                this.logger.error(`Request ID: ${reqId} - Error creating user with data ${JSON.stringify(userData)}, 
                reason: ${error.message}`);
                throw error;
            });
    }

    /**
     * Update Profile
     *
     * @param id
     * @returns {Promise.<TResult>}
     */
    update(id, data) {
        let reqId = shortid.generate();
        this.logger.info(`Request ID: ${reqId} - Updating user with id: ${id}`);
        return User.where({id: id})
            .save(data, { patch:true })
            .then((user) => {
                this.logger.info(`Request ID: ${reqId} - Update was succesful for user with id ${id}`);
                return user;
            })
            .catch((error) => {
                this.logger.error(`Request ID: ${reqId} - Error updating user with id ${id}, 
                reason: ${error.message}`);
                throw error;
            });
    }

    /**
     * GET ALL USERS
     *
     */
    list() {
        let reqId = shortid.generate();
        this.logger.info(`Request ID: ${reqId} - Fetching All Users`);

        return new User()
        .fetchAll()
        .then((data) => {
            this.logger.info(`Request ID: ${reqId} - All users fetched: `, JSON.stringify(data));
            return data;
        })
        .catch((error) => {

            this.logger.error(`Request ID: ${reqId} - Error fetching Pro with id,  
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
     * 
     * EDIT CBT questions
     * /PATCH
     * 
     */
    imageUpload(id, data){

        const tempPath = req.files.file.path,
        targetPath = path.resolve('./uploads/image.png');
 
         let reqId = shortid.generate();
         this.logger.info(`Request ID: ${reqId} - Retrieve a cbt question with id: ${id}`);
 
         this.logger.info(`Request ID: ${reqId} - Want to update question with question id `, id);
         Cbt
         .where({id: id})
         .save(questionsdata,{patch:true})
         .then((questionsdata) => {
             this.logger.info(`Request ID: ${reqId} - Update was succesful on question with id `, id);
             return data;
         }).catch(error => {
 
             this.logger.error(`Request ID: ${reqId} - Update on question  cannot be done with question id ${id}, 
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

    formatPhoneNumber(phoneNumber) {
        let initialCode = phoneNumber.substring(0, 1);
        let fullNumber;
        if (initialCode == 0) {
            let internationalPrefix = '+234';             
            fullNumber = internationalPrefix + phoneNumber.substring(1);  //concatenate with +234
        } else if (phoneNumber.substring(0, 3) === '234') {
            fullNumber = `+${phoneNumber}`
        } else {
            fullNumber = phoneNumber;
        }
        return fullNumber;
    }

    /**
     * Genrate Referral Code
     *
     * @returns code
     */
    generateReferralCode() {
        this.logger.info(`Generating Referal code`);

        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      
        for (var i = 0; i < 5; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));
      
        return text;
       
    }

    /**
     * Genrate User ID
     * @param identityCode (0-Admin, 1-User, 2- Pro,)
     * @returns code
     */
    generateUserID(type) {
        this.logger.info(`Generating user ID`);
        let types = {
            user: 'USER',
            pro: 'PRO',
            admin: 'ADMIN'
        }
        let todayDate = new Date();
        let identity = `WR/${types[type]}/${todayDate.getFullYear()}/${todayDate.getMonth()}/${todayDate.getTime()}`;
        return identity;
    }
}

module.exports = AccountService;

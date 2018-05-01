'use strict';

let User = require('app/models/user');
let Pro = require('app/models/pro');
let shortid = require('shortid');
let constants = require('app/config/constants');
let config = require('app/config/config');
let errors = require('app/errors');
let bcrypt = require('bcryptjs');
let jwt = require('jsonwebtoken');

let notifications  = require('app/lib/notifications');

class AccountService {

    /**
     * Account service constructor
     *
     * @constructor
     * @param {logger} logger instance of the logger
     */
    constructor(logger) {
        this.logger = logger;
       // this.notifications = notificationService;
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

    prologin(phone,password) {
       
        const phoneNumber = this.formatPhoneNumber(phone);

        let reqId = shortid.generate();
        this.logger.info(`Request ID: ${reqId} - Retrieve a professional with phone: ${phone}`);

        return new User({ proPhoneNumber: phoneNumber })
            .fetch({ require: true })
            .then(pro => {

                this.logger.info(`Request ID: ${reqId} - Retrieved pro `, pro);

                return this.comparePasswords(password, pro.get('password')).then((match) => {
                    if (!match) {

                        throw new errors.PasswordMissmatch('Wrong password supplied');
                    }

                    let payload = { id: pro.id }; //only expose user-id in token

                    return { token: jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn }) };

                });
            }).catch(error => {

                this.logger.error(`Request ID: ${reqId} - Error retrieving user with email ${phoneNumber}, 
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

    facebooklogin(email, password) {
    

        
    }

      /**
     * Facebook Login 
     *
     * @param email
     * @param password
     * @returns {Promise.<TResult>}
     */

    proFacebookLogin(email, password) {
    

        
    }
    
  /**
     * Users Referral Code  
     *
     * @param email
     * @returns {Promise.<TResult>}
     */
    usersReferralCode()
    {
        const email = req.params.userEmail;
       
        let reqId = shortid.generate();
        this.logger.info(`Request ID: ${reqId} - Retrieve a user with email: ${email}`);

        const updateOps= {};
        for(const op of req.body) {

            updateOps[op.propName] = op.value;
         }
        return new User.update()
       .fetch({ require: true })
       .then(user => {

           this.logger.info(`Request ID: ${reqId} - Retrieved user `, user);
           //try to update user here
           return user;
       }).catch(error => {

           this.logger.error(`Request ID: ${reqId} - Error retrieving user with email ${email}, 
           reason: ${error.message}`);
           throw error;
       });

    }

    

        
    /**
     * SignUp
     *
     * @param userData
     * @returns {Promise.<TResult>}
     */
    proSignup(proData) {

        let reqId = shortid.generate();
        this.logger.info(`Request ID: ${reqId} - Creating a pro with data: ${JSON.stringify(proData)}`);

        let data = proData;
        data.password = this.constructor.encryptPassword(data.password);
        data.referralCode = this.generateReferralCode();
        data.proID= this.generateProID();

        return new Pro().save(data)
            .then((pro) => {
                this.logger.info(`Request ID: ${reqId} - User created `, JSON.stringify(this.prologin));
                delete pro.attributes.password;
                
                return pro;
            }).catch((error) => {

                this.logger.error(`Request ID: ${reqId} - Error creating user with data ${JSON.stringify(userData)}, 
                reason: ${error.message}`);
                throw error;
            });
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
        data.userID= this.generateUserID();

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
     * @param id
     * @returns {Promise.<TResult>}
     */
    profile(id) {

        let reqId = shortid.generate();
        this.logger.info(`Request ID: ${reqId} - Retrieve a user with id: ${id}`);

        return new User({ id: id })
       .fetch({ require: true })
       .then(user => {

           this.logger.info(`Request ID: ${reqId} - Retrieved user `, user);
           return user;
       }).catch(error => {

           this.logger.error(`Request ID: ${reqId} - Error retrieving user with id ${id}, 
           reason: ${error.message}`);
           throw error;
       });
    }


     /**
     * Pro Profile
     *
     * @param id
     * @returns {Promise.<TResult>}
     */
    proProfile(id) {

        let reqId = shortid.generate();
        this.logger.info(`Request ID: ${reqId} - Retrieve a pro with id: ${id}`);

        return new Pro({ id: id })
       .fetch({ require: true })
       .then(pro => {

           this.logger.info(`Request ID: ${reqId} - Retrieved pro `, pro);
           return pro;
       }).catch(error => {

           this.logger.error(`Request ID: ${reqId} - Error retrieving pro with id ${id}, 
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
    updateprofile(userid, userData)
     {
       const id = userid;

        let reqId = shortid.generate();
        this.logger.info(`Request ID: ${reqId} - Retrieve a user with id: ${id}`);
        User
        .where({id: id})
        .save(userData,{patch:true})
        .then(user => {
           this.logger.info(`Request ID: ${reqId} - Update was succesful for user with id `, id);
           return user;
       }).catch(error => {

           this.logger.error(`Request ID: ${reqId} - Error retrieving user with id ${id}, 
           reason: ${error.message}`);
           throw error;
       });
    }

    /**
     * Update Pro Profile
     *
     * @param id
     * @returns {Promise.<TResult>}
     */
    updateProProfile(proid, proData)
     {
       const id = proid;

        let reqId = shortid.generate();
        this.logger.info(`Request ID: ${reqId} - Retrieve a pro with id: ${id}`);
        Pro
        .where({id: id})
        .save(proData,{patch:true})
        .then(pro => {
           this.logger.info(`Request ID: ${reqId} - Update was succesful for pro with id `, id);
          
           return pro;
       }).catch(error => {

           this.logger.error(`Request ID: ${reqId} - Error retrieving pro with id ${id}, 
           reason: ${error.message}`);
           throw error;
       });
    }


/**
     * Update Referal Code
     *
     * @param userid
     * @returns {Promise.<TResult>}
     */
    updateReferralCode(userid,userData)
     {
       const id = userid;
       const invitedByReferralCode = userData.invitedByReferralCode;

        let reqId = shortid.generate();
        this.logger.info(`Request ID: ${reqId} - Retrieve a user with id: ${id}`);
        /*If the function is used to update Referral code, 
        check if referralcode is correct before proceeding
        */
       this.logger.info(`Request ID: ${reqId} - Verifying if the inivted referal code `, invitedByReferralCode, ' exists to any user '); 
       User
       .where({referralCode: invitedByReferralCode })
       .fetch({ require: true })
       .then(user => 
        {
             this.logger.info(`Request ID: ${reqId} - The inivited referal code `, invitedByReferralCode, ' exists and is correct to a user with id ', user.id);
             this.logger.info(`Request ID: ${reqId} - Want to update the referral code to a user who invited the user with code  `, invitedByReferralCode);
        User
        .where({id: id})
        .save(user,{patch:true})
        .then((data) => {
            this.logger.info(`Request ID: ${reqId} - Update was succesful on user with id `, id ," for invitedReferralcode ", invitedByReferralCode);
            return data;
        }).catch(error => {

            this.logger.error(`Request ID: ${reqId} - Update on invitedreferral code cannot be done on user with id ${id}, 
            reason: ${error.message}`);
            throw error;
        });

  
       })/*.catch(error => {

        this.logger.error(`Request ID: ${reqId} - Error, Referral code, ${id}, does not exist
        reason: ${error.message}`);
        throw error;
    });*/
       
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
     * Phone Verification
     *
     * @param phoneNumber
     * @returns {Promise.<TResult>}
     */

    phoneVerification(phoneNumber) {
        this.logger.info(`Sending OTP to phone number: ${phoneNumber}`);
        var getOTP = this.generateOTP()
        var message = "Your OTP verification code is: " .getOTP;
        
      //  this.notifications.se
 
    }

 /**
     * Genrate Referral Code
     *
     * @returns code
     */

    generateReferralCode() 
    {
        this.logger.info(`Generating Referal code: `);

        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      
        for (var i = 0; i < 5; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));
      
        return text;
       
     }

      /**
     * Genrate Referral Code
     *@param identityCode (0-Admin, 1-User, 2- Admin,)
     * @returns code
     */

        generateUserID() 
        {
            var identityCode="USER";
            var todayDate = new Date();
            var person="";
            var identity="";

            person +="user";
                identity += "WR/"+identityCode + '/'+todayDate.getFullYear()+"/"+todayDate.getMonth()+"/"+todayDate.getTime();
                return identity;
         }

    generateProID() 
    { 
        var identityCode="PRO";
        var todayDate = new Date();
        var person="";
        var identity="";
        identity += "WR/"+identityCode + '/'+todayDate.getFullYear()+"/"+todayDate.getMonth()+"/"+todayDate.getTime();
        
        return identity;
    }

    generateAdminID() 
    { 
    return "WR- ADMIN";
    }

      /**
     *OTP CODE
     *
     * @returns code
     */
    generateOTP() 
    {
        var possibleOTPArr = "0123456789";
        var otpmessage="";
      
        for (var i = 0; i < 5; i++)
        otpmessage += possible.charAt(Math.floor(Math.random() * possible.length));
      
        return otpmessage;
       
     }
        


}

module.exports = AccountService;

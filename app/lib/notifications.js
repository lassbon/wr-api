'use strict';

let constants = require('app/config/constants');
let config = require('app/config/config');
let errors = require('app/errors');
let client = require('twilio');



class NotificationService {

    /**
     * Notification service constructor
     *
     * @constructor
     * @param {logger} logger instance of the logger
     */
    constructor(logger) {
        this.logger = logger;
    }



    /**
     * send OTP
     *
     * @param phoneNumber
     * @param messageBody
     * @return {Promise}
     */
    sendSMS(customerPhoneNumber, messageBody)
     {
        // Twilio Credentials
        const accountSid = config.accountSid;
        const authToken = config.authToken;
        const phoneNumber = config.phoneNumber;

        client.messages
        .create({
              to: customerPhoneNumber,
            from: phoneNumber,
            body: messageBody,
        }).then((data) => 
        {
            res.send(httpStatus.OK, data);

        }).catch((error) => {
            switch (error.constructor){
                case errors.customerPhoneNumberNotFound:
                case errors.customerPhoneNumberInCorrect:
                    res.send(httpStatus.INTERNAL_SERVER_ERROR,
                        new errors.UserExists('The Customer PhoneNumber is not spplied or incorrect'));
                    break;
                case errors.messageBodyIsEmpty:
                    res.send(httpStatus.INTERNAL_SERVER_ERROR,
                        new errors.EmptyMessage('MEssage body cannot be empty'));
                default:
                    res.send(httpStatus.INTERNAL_SERVER_ERROR,
                        new errors.InternalServerError('Internal Server Error, please check the API logs for details'));
            }
        }).then(next);
    
    }


    /**
     * send Email
     *
     * @param email
     * @param emailBody
     * @return {Promise}
     */
    sendEMAIL(customerEmail, emailBody)
     {

        

     }





   
}

module.exports = NotificationService;


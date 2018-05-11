'use strict';

let constants = require('app/config/constants');
let config = require('app/config/config');
let errors = require('app/errors');



class Notification {

    /**
     * Notification service constructor
     *
     * @constructor
     * @param {logger} logger instance of the logger
     * @param {smsClient} smsClient instance of an smsClient
     */
    constructor(logger, smsClient) {
        this.smsClient = smsClient;
        this.logger = logger;
    }

    /**
     * send OTP Via sms
     *
     * @param phoneNumber
     * @param messageBody
     * @return {Promise}
     */
    sendSms(receiverPhone, message) {
        const senderPhone = config.OTPsetupDetails.phoneNumber;
        this.logger.info(`Sending sms: ${message} to phone: ${receiverPhone}`);

        return this.smsClient.messages
        .create({
            to: receiverPhone,
            from: senderPhone,
            body: message,
        })
        .then((message) => {
            this.logger.info(`Successfully sent sms and got response: ${JSON.stringify(message)}`);
            return message;
        })
        .catch((error) => {
            this.logger.error(`There was an error while sending sms: ${error}`);
            throw error;
        });
    
    }


    /**
     * send Email
     *
     * @param email
     * @param emailBody
     * @return {Promise}
     */
    sendMail(customerEmail, emailBody){
        // TODO: add mail sending client
    }
   
}

module.exports = Notification;


'use strict';

let User = require('app/models/user');
let UserType = require('app/models/usertype');
let Question = require('app/models/question');
let shortid = require('shortid');
var shortIdGen = require('short-id-gen');
let constants = require('app/config/constants');
let config = require('app/config/config');
let errors = require('app/errors');
let bcrypt = require('bcryptjs');
let jwt = require('jsonwebtoken');
let ResourceService = require('app/services/resource');

class QuestionService extends ResourceService {

    /**
     * Account service constructor
     *
     * @constructor
     * @param {logger} logger instance of the logger
     * @param {logger} logger instance of the notification library
     */
    constructor(logger, notificationLib) {
        super(logger, notificationLib);
    }

    /**
     * GET /questions
     * Get all questions
     */
    list(){
        let reqId = shortid.generate();
        this.logger.info(`Request ID: ${reqId} - Getting all cbt  questions`);

        return new Question().fetchAll()
            .then((data) => {
                this.logger.info(`Request ID: ${reqId} - getting all questions `, JSON.stringify(data));
                                
                return data;
            })
            .catch((error) => {

                this.logger.error(`Request ID: ${reqId} - Error getting questions, 
                reason: ${error.message}`);
                throw error;
            });

    }

    /**
     * 
     * PUT /question
     * Update a question
     * 
     */
    update(id, data){
        let reqId = shortid.generate();
        this.logger.info(`Request ID: ${reqId} - Updating question with id `, id);
        return Question.where({id: id})
        .save(data, { patch:true })
        .then((question) => {
            this.logger.info(`Request ID: ${reqId} - Update was succesful on question with id `, id);
            return question;
        })
        .catch(error => {

            this.logger.error(`Request ID: ${reqId} - There was an error updating question ${id}, 
            reason: ${error.message}`);
            throw error;
        });
    }

    /**
     * POST questions
     * Add questions
     */
    add(data){
        let reqId = shortid.generate();
        this.logger.info(`Request ID: ${reqId} - Creating a cbt with question: ${JSON.stringify(data)}`);

        return new Question().save(data)
            .then((question) => {
                this.logger.info(`Request ID: ${reqId} - Question created `, JSON.stringify(question));
                                
                return question;
            }).catch((error) => {

                this.logger.error(`Request ID: ${reqId} - Error creating Question with data ${JSON.stringify(data)}, 
                reason: ${error.message}`);
                throw error;
            });
    }
  
    /**
     * GET a question
     *
     */
    get(id){
        let reqId = shortid.generate();
        this.logger.info(`Request ID: ${reqId} - Get cbt with question id: ${(id)}`);

        return new Question().where({id: id})
        .fetch({ require: true })
        .then((question) => {
            this.logger.info(`Request ID: ${reqId} - Question fetched:  `, JSON.stringify(question));
            return question;
        })
        .catch((error) => {

            this.logger.error(`Request ID: ${reqId} - Error fetching Question with id ${(id)}, 
            reason: ${error.message}`);
            throw error;
        });
    }

    /**
     * EDIT questions
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
}

module.exports = QuestionService;

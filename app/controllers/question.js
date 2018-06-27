'use strict';

let httpStatus = require('http-status');
let errors     = require('app/errors');

class QuestionController {

    /**
     * Class constructor
     *
     * @constructor
     * @param questionService - question service instance via dependency injection
     *
     */
    constructor(questionService) {
        this.service = questionService;
    }

    /**
     * Endpoint GET /questions
     * GET all Questions 
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

    /**
     * Endpoint GET /questions/:id
     * Signup 
     * @param req
     * @param res
     * @param next
     */
    get(req, res, next) {

        this.service.get(req.params.id)
        .then((data) => {
            res.send(httpStatus.OK, data);
        })
        .catch((error) => {
            switch (error.constructor){
                case errors.QuestionNotFound:
                    res.send(httpStatus.NOT_FOUND, error);
                    break;
                 default:
                     res.send(httpStatus.INTERNAL_SERVER_ERROR, error);
             }
    
        }).then(next);
    }
    
    /**
     * Endpoint POST /questions
     * Signup 
     * @param req
     * @param res
     * @param next
     */
    add(req, res, next) {

        this.service.add(req.body)
        .then((data) => {
            res.send(httpStatus.CREATED, data);
        })
        .catch((error) => {
            res.send(httpStatus.INTERNAL_SERVER_ERROR,
                new errors.InternalServerError('Internal Server Error, please check the API logs for details'));
    
        }).then(next);
    }

    /**
     * Endpoint PUT /questions
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

module.exports = QuestionController;

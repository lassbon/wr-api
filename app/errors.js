/**
 @description Define errors available in project
 **/

'use strict';

let create = require('custom-error-generator');

module.exports = {

    InvalidVersion: create('InvalidVersion', { code: 'INVALID_VERSION' }),

    MethodNotImplemented: create('MethodNotImplemented', { code: 'METHOD_NOT_IMPLEMENTED' }),

    InvalidParamError: create('InvalidParamError', { code: 'INVALID_PARAMS' }),

    InvalidContentTypeError: create('InvalidContentType', { code: 'INVALID_CONTENT_TYPE' }),

    InternalServerError: create('InternalServerError', { code: 'INTERNAL_SERVER_ERROR' }),

    RecipeNotFound: create('RecipeNotFound', { code: 'RECIPE_NOT_FOUND' }),

    DuplicateRecipeName: create('DuplicateRecipeName', { code: 'DUPLICATE_RECIPE_NAME' }),

    Unauthorized: create('Unauthorized', { code: 'UNAUTHORIZED' }),

    UserExists: create('UserExists', { code: 'USER_EXISTS' }),

    //this exception will only be used internally and will never get thrown to client
    UserNotFound: create('UserNotFound', { code: 'USER_NOT_FOUND' }),

    //this exception will only be used internally and will never get thrown to client
    PasswordMissmatch: create('PasswordMissmatch', { code: 'PASSWORD_MISSMATCH' }),


    ResourceNotFound: create('ResourceNotFound', { code: 'RESOURCE_NOT_FOUND' })



};

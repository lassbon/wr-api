'use strict';

/**
 * Response formatter.
 *
 * @param req the request object
 * @param res the response object
 * @param body the response body
 * @param cb callback function to execute
 * @returns {*}
 */
function formatResponse(req, res, body, cb) {
    let packet = {};

    // backward compatibility with Resitfy 3
    cb = cb || function (error, result) {
            console.log('WARNING: using restify 4 middleware with restify 3!');
            return result;
        };

    if (body instanceof Error) {

        // handle errors responses
        packet.status  = 'error';
        packet.message = (body.message === '' && body.defaultMessage) ? body.defaultMessage : body.message;

        // add the error code if it is available
        if (body.code !== undefined) {
            packet.code = body.code;
        }

    } else {
        // handle success responses
        packet = {
            status: 'success',
            data: body
        };
    }

    let data = JSON.stringify(packet);
    res.header('Content-Length', Buffer.byteLength(data));

    return cb(null, data);
}

module.exports = formatResponse;

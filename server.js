'use strict';

// enable newrelic for service
if (process.env.NEW_RELIC_APP_NAME !== undefined &&
    process.env.NEW_RELIC_LICENSE_KEY !== undefined) {

    try {
        require('newrelic');
    } catch (e) {
        console.log(e); // using console here, because logger not defined yet.
    }
}

// include dependencies
let config     = require('app/config/config');
let routes     = require('app/routes/routes');
let handlers   = require('app/routes/handlers');
let errors     = require('app/errors');

let joi        = require('joi');
let restify    = require('restify');
let versioning = require('app/lib/versioning');

let yamljs = require('yamljs');
let docs = yamljs.load('swagger.yaml');

let validationMiddleware = require('app/lib/validation_middleware');
let formatter = require('app/lib/response_formatter_middleware');

// service locator via dependency injection
let serviceLocator = require('app/config/di');
let log = serviceLocator.get('logger');
let accountService = serviceLocator.get('accountService');

let passport = require('passport');
let passportJWT = require('passport-jwt');
var FacebookStrategy = require('passport-facebook').Strategy;

let ExtractJwt = passportJWT.ExtractJwt;
let JwtStrategy = passportJWT.Strategy;
// load the auth variables
var configAuth = require('app/config/socialauth');

let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromHeader('x-user-token');
jwtOptions.secretOrKey = config.jwt.secret;

var strategy = new JwtStrategy(jwtOptions, (jwtPayload, next) => {

    // locate the user which token belongs to:
    accountService.findUser(jwtPayload.id).then((user) => {
        next(null, user.toJSON());

    }).catch((err) => {
        switch (err.constructor){
            case errors.UserNotFound:
                next(null, false);
                break;
            default:
                next(err); // internal server error when trying to find user
        }
    });
});

//allow facebook login
passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

passport.use(strategy);

// Initialize web service
let server = restify.createServer({
    name: config.appName,
    versions: ['1.0.0'],
    formatters: {
        'application/json': formatter
    }
});

// enable CORS for documentation to be used on local/staging
if (config.environment !== 'production') {
    server.use(restify.CORS());
}

server.use(passport.initialize());

// set API versioning and allow trailing slashes
server.pre(restify.pre.sanitizePath());
server.pre(versioning({ prefix: '/' }));

// set request handling and parsing
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.use(validationMiddleware.paramValidation(log, joi));
server.use(validationMiddleware.headerValidation(log));

// setup Routing and Error Event Handling
handlers.setup(server, serviceLocator);
routes.setup(server, serviceLocator, passport, docs);

// start server
server.listen(config.web.port, () => {
    log.info('%s listening at %s', server.name, server.url);

    if (process.env.NODE_ENV === 'development') {
        require('app/lib/route-table')(server.router.mounts);
    }
});

// for regression tests purpose
module.exports = server;

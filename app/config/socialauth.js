module.exports = {

    'facebookAuth' : {
        'clientID'      : '2080369932204037', // App ID
        'clientSecret'  : '49e7b6a59ebb9ec007c42a6bd86de0c3', // App Secret
        'callbackURL'   : 'http://localhost:8080/auth/facebook/callback',
        'profileURL'    : 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
        'profileFields' : ['id', 'email', 'name'] // For requesting permissions from Facebook API
    },

    'twitterAuth' : {
        'consumerKey'       : '',//consumer-key
        'consumerSecret'    : '',//client-secret
        'callbackURL'       : 'http://localhost:8080/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : '',//secret-clientID
        'clientSecret'  : '',//client-secret-
        'callbackURL'   : 'http://localhost:8080/auth/google/callback'
    }

};
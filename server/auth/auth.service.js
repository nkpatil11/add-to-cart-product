'use strict';
var config = require('../config/environment');
var jwt = require('jsonwebtoken');
var compose = require('composable-middleware');

function isAuthenticated() {
    return compose()
        .use(function (req, res, next) {
            jwt.verify(req.headers.authorization, config.secrets.session, function (err, user) {
                if (err) {
                    return res.send(403);
                } else {
                    req.user = user;
                    next();
                }
            });
        });
}

function isAuthorized() {
    return compose().use(isAuthenticated());
}

function signToken(user) {
    var payload = {
        userId: user._id,
        userName: user.name,
        email: user.email_address
    };
    return jwt.sign(payload, config.secrets.session, config.expires);
}

exports.isAuthenticated = isAuthenticated;
exports.signToken = signToken;
exports.isAuthorized = isAuthorized;
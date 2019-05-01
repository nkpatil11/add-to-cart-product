
'use strict';
var Q = require('q');
var crypto = require('crypto');
var auth = require('./auth.service');
var User = require('../api/user/user.model');

var encryptPassword = function (password, salt) {
    if (!password || !salt) return '';
    return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha1').toString('base64');
};

var authenticate = function (plainText, salt, hash) {
    return encryptPassword(plainText, salt) === hash;
};

exports.authUser = function (req) {
    var defer = Q.defer();
    User.find({  email_address: req.body.email_address.toLowerCase() },function(err, result){
        if (err) {
            console.error(err);
            var error = new Error('An Internal Error Has Occured');
            defer.reject(error);
        } else if (result.length > 0) {
            var user = result[0];

            var match = authenticate(req.body.password, user.salt, user.hashedPassword);
            if (match == true) {
                var token = auth.signToken(user);
                delete user['hashedPassword'];
                delete user['salt'];
                delete user['resetPasswordToken'];
                delete user['resetPasswordExpires'];
                defer.resolve({
                    status: 200,
                    token: token,
                    currentUser: user
                });
            } else {
                defer.resolve({
                    status: 401,
                    message: 'Invalid user name or password.'
                });
            }
        } else {
            defer.resolve({
                status: 401,
                message: 'Invalid user name or password.'
            });

        }
        });
    return defer.promise;
};
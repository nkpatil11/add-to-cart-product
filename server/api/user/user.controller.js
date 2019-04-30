'use strict';
var Q = require('q');
var crypto = require('crypto');
var User = require('./user.model');

var makeSalt = function () {
    return crypto.randomBytes(16).toString('base64');
};

var encryptPassword = function (password, salt) {
    if (!password || !salt) return '';
    return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha1').toString('base64');
};

var authenticate = function (plainText, salt, hash) {
    return encryptPassword(plainText, salt) === hash;
};

exports.saveUser = function (req) {
    var defer = Q.defer();
    var password = req.body.password;
    var salt = makeSalt();
    var hashedPassword = encryptPassword(password, salt);
    req.body.salt = salt;
    req.body.hashedPassword = hashedPassword;
    var newUser = new User(req.body);
    Q.ninvoke(User, 'create', newUser)
        .then(function (user) {
            defer.resolve(user);
        })
        .catch(function (error) {
            defer.reject(error);
        });
    return defer.promise;
};

exports.changePassword = function (req) {
    var defer = Q.defer();
    var query = {_id:req.user.userId};
    User.find(query, function (err, result) {    
        if (err) {
            console.error(err);
            var error = new Error('An Internal Error Has Occured');
            defer.reject(error);
        } else if (result.length > 0) {
            var user = result[0];
            var match = authenticate(req.body.oldPassword, user.salt, user.hashedPassword);
            if (match === true) {
                var salt = makeSalt();
                var hashedPassword = encryptPassword(req.body.newPassword, salt);

                    user.hashedPassword = hashedPassword;
                    user.salt = salt;
                    user.save(function (err) {
                        if (err) {
                            console.error(err);
                            var error = new Error('An Internal Error Has Occured');
                            defer.reject(error);
                        } else {
                            defer.resolve({
                                status: 200,
                                message: 'Success! Your password has been changed.'
                            });
                        }
                    });
            } else {
                defer.resolve({
                    status: 401,
                    message: 'Invalid current password.'
                });
            }
        } else {
            defer.resolve({
                status: 404,
                message: 'Something went wrong, please try again.'
            });
        }
    });
    return defer.promise;
};
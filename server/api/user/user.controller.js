'use strict';
var Q = require('q');
var crypto = require('crypto');
var User = require('./user.model');
var config = require('../../config/environment');
var mailtransporter = require('../../config/email');
var EmailTemplate = require('email-templates').EmailTemplate;
var path = require('path');
var templateDir = path.join(__dirname, '../../email_templates/');

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
            var locals = {
                name: req.body.name,
                email: req.body.email_address,
                link: req.protocol + '://' + req.headers.host + '/#/login'
            };

            var template = new EmailTemplate(path.join(templateDir, 'signup'));
            var smtpTransport = mailtransporter.transpoter();
            template.render(locals, function (err, results) {
                smtpTransport.sendMail({
                    to: req.body.email_address,
                    from: config.email.from,
                    subject: 'Signup Request',
                    html: results.html,
                    text: results.text
                });
            });
            defer.resolve();
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

var encryptString = function (string) {
    var cipher = crypto.createCipher('aes-256-ctr', 'd6F3Efeq');
    var crypted = cipher.update(string, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
};

var decryptString = function (string) {
    var decipher = crypto.createDecipher('aes-256-ctr', 'd6F3Efeq');
    var dec = decipher.update(string, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
};

exports.forgotPassword = function (req) {
    var token;
    crypto.randomBytes(20, function (err, buf) {
        token = buf.toString('hex');
    });
    var defer = Q.defer();
    var query = {email_address:req.body.email_address};
    User.find(query, function (err, result) {
        if (err) {
            console.error(err);
            var error = new Error('An Internal Error Has Occured');
            defer.reject(error);
        } else if (result.length > 0) {
            var user = result[0];
            var ref = encryptString(user.email_address);
            var salt = makeSalt();
            var hashedToken = encryptPassword(token, salt);
            user.resetPasswordTokenSalt = salt;
            user.resetPasswordToken = hashedToken;
            user.resetPasswordExpires = Date.now() + 600000; // 10 minutes
            user.save(function (err) {
                if (user) {
                    var locals = {
                        email: user.email_address,
                        name: user.name,
                        message: 'Password Reset',
                        link: req.protocol + '://' + req.headers.host + '/#/ref/' + ref + '/reset/' + token
                    };
                    var smtpTransport = mailtransporter.transpoter();
                    var template = new EmailTemplate(path.join(templateDir, 'contact-request'));
                    template.render(locals, function (err, results) {
                        smtpTransport.sendMail({
                            to: user.email_address,
                            from: config.email.from,
                            subject: 'Password Reset',
                            html: results.html,
                            text: results.text
                        }, function (err) {
                            defer.resolve({
                                code: 200,
                                message: 'An e-mail has been sent to ' + user.email_address + ' with further instructions.'
                            });
                        });
                    });
                }
            });
        } else {
            defer.resolve({
                code: 200,
                message: 'An e-mail has been sent to ' + req.body.email_address + ' with further instructions.'
            });
        }
    });
    return defer.promise;
};

exports.verifyToken = function (req) {
    var defer = Q.defer();
    var email = decryptString(req.params.ref);

    var query = {email_address: email};
    User.find(query, function (err, result) {
        if (err) {
            console.error(err);
            var error = new Error('An Internal Error Has Occured');
            defer.reject(error);
        } else if (result.length > 0) {
            var user = result[0];

            var match = authenticate(req.params.token, user.resetPasswordTokenSalt, user.resetPasswordToken);
            if (match === true) {
                var now = new Date().getTime();
                if (now > user.resetPasswordExpires) {
                    defer.resolve({
                        message: 'Password reset token is invalid or has expired.'
                    });
                } else {
                    defer.resolve({
                        message: 'Success'
                    });
                }
            } else {
                defer.resolve({
                    message: 'Password reset token is invalid or has expired.'
                });
            }
        } else {
            defer.resolve({
                message: 'Password reset token is invalid or has expired.'
            });
        }
    });
    return defer.promise;
};

exports.resetPassword = function (req) {
    var defer = Q.defer();
    var email = decryptString(req.params.ref);
    var query = {email_address: email};
    User.find(query, function (err, result) {
        if (err) {
            console.error(err);
            var error = new Error('An Internal Error Has Occured');
            defer.reject(error);
        } else if (result.length > 0) {
            var user = result[0];
            var match = authenticate(req.params.token, user.resetPasswordTokenSalt, user.resetPasswordToken);
            if (match === true) {
                var now = new Date().getTime();
                if (now > user.resetPasswordExpires) {
                    defer.resolve({
                        message: 'Password reset token is invalid or has expired.'
                    });
                } else {
                    var salt = makeSalt();
                    var hashedPassword = encryptPassword(req.body.password, salt);

                    user.salt = salt;
                    user.hashedPassword = hashedPassword;
                    user.resetPasswordTokenSalt = undefined;
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpires = undefined;
                    user.save(function (err) {
                        if (err) {
                            console.error(err);
                            var error = new Error('An Internal Error Has Occured');
                            defer.reject(error);
                        } else {
                            var mailOptions = {
                                to: user.email_address,
                                from: config.email.from,
                                subject: 'Your password has been changed',
                                text: 'Hello '+user.name+',\n\n' +
                                    'This is a confirmation that the password for your account ' + user.email_address + ' has just been changed.\n'
                            };
                            var smtpTransport = mailtransporter.transpoter();
                            smtpTransport.sendMail(mailOptions, function (err) {
                                defer.resolve({
                                    message: 'Success! Your password has been changed.'
                                });
                            });
                        }
                    });
                }
            } else {
                defer.resolve({
                    message: 'Password reset token is invalid or has expired.'
                });
            }
        } else {
            defer.resolve({
                message: 'Password reset token is invalid or has expired.'
            });
        }
    });
    return defer.promise;
};
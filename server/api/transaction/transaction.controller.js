'use strict';
var Q = require('q');
var Transaction = require('./transaction.model');

exports.getAllTransactions = function (req) {
    var defer = Q.defer();
    Transaction.find({user_id: req.user.userId}, function (err, result) {
        if (err) {
            console.error(err);
            var error = new Error('An Internal Error Has Occured');
            defer.reject(error);
        }
        defer.resolve(result);
    });
    return defer.promise;
};
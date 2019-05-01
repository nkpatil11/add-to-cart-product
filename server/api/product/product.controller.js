'use strict';
var Q = require('q');
var Product = require('./product.model');

exports.getAllProducts = function (query) {
    var defer = Q.defer();
    Product.find({}, function (err, result) {
        if (err) {
            console.error(err);
            var error = new Error('An Internal Error Has Occured');
            defer.reject(error);
        }
        defer.resolve(result);
    });
    return defer.promise;
};
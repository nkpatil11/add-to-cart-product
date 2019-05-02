'use strict';
angular.module('mynewtask').factory('ProductService', function ($http) {

    var getAllProducts = function () {
        return $http.get('/api/products');
    };

    var payNow = function (token) {
        return $http.post('/api/products/paynow', token);
    };

    return {
        getAllProducts: getAllProducts,
        payNow: payNow
    };
});
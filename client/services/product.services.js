'use strict';
angular.module('mynewtask').factory('ProductService', function ($http) {

    var getAllProducts = function () {
        return $http.get('/api/products');
    };

    return {
        getAllProducts: getAllProducts
    };
});
'use strict';
angular.module('mynewtask').config(function ($routeProvider) {
    $routeProvider
        .when('/product/list', {
            url: '/product',
            templateUrl: 'app/product/product.html',
            controller: 'ProductCtrl',
            authenticate: true
        });
});
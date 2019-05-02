'use strict';
angular.module('mynewtask').config(function ($routeProvider) {
    $routeProvider
        .when('/transaction/list', {
            url: '/transaction',
            templateUrl: 'app/transaction/transaction.html',
            controller: 'TransactionCtrl',
            authenticate: true
        });
});
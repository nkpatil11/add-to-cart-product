'use strict';
angular.module('mynewtask').factory('TransactionService', function ($http) {

    var getAllTransactions = function () {
        return $http.get('/api/transactions/list');
    };

    return {
        getAllTransactions: getAllTransactions
    };
});
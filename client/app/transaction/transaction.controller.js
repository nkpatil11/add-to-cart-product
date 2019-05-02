'use strict';
angular.module('mynewtask').controller('TransactionCtrl', function ($scope, TransactionService) {

    $scope.getTransactions = function () {
        TransactionService.getAllTransactions().success(function (response) {
            $scope.transactions = response;
        });
    };

    function init() {
        $scope.getTransactions();
    }

    init();
});
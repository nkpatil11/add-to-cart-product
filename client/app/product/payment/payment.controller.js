'use strict';
angular.module('mynewtask').controller('PaymentCtrl', function ($scope, $modalInstance, aValue) {

    $scope.valuePassed = aValue;

    $scope.close = function () {
        $modalInstance.close('');
    };

    $scope.totalAmount = function () {
        var sum = 0;
        for (var i = 0; i < $scope.valuePassed.length; i++) {
           sum += $scope.valuePassed[i].price;
        }
        return sum;
    };

    $scope.payNow = function () {

    };

});
'use strict';
angular.module('mynewtask').controller('ForgotPasswordCtrl', function ($scope, UserService) {

    $scope.message_style = '';

    $scope.resetPassword = function (form) {
        $scope.submitted = true;
        if (form.$valid) {
            UserService.forgotPassword({
                'email_address': $scope.email_address
            }).success(function (response) {
                if (response.code === 200) {
                    $scope.message_style = 'success';
                    $scope.message = response.message;
                } else {
                    $scope.message_style = 'danger';
                    $scope.message = response.message;
                }
            });
        }
    };
});
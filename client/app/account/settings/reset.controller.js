'use strict';
  angular.module('mynewtask').controller('ResetCtrl', function ($scope, UserService, $routeParams) {

    $scope.showPasswordChange = false;
    $scope.showTokenExpired = false;

    $scope.resetPassword = function (form) {
        $scope.submitted = true;
        if (form.$valid) {
            if ($scope.newPassword === $scope.confirmPassword) {
                $scope.message = '';
                UserService.resetPassword($routeParams.ref, $routeParams.token, {
                    'password': $scope.newPassword
                }).success(function (response) {
                    $scope.message = response.message;
                });
            } else {
                $scope.message = 'Password did not match.';
            }
        } else {
            $scope.message = 'Password did not match.';
        }
    };

    var verifyToken = function () {
        UserService.verifyToken($routeParams.ref, $routeParams.token).success(function (response) {
            if (response.message === 'Success') {
                $scope.showPasswordChange = true;
            } else {
                $scope.showTokenExpired = true;
            }
        });
    };

    function init() {
        verifyToken();
    }
    init();

});
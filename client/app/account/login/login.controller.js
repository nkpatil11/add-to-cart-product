'use strict';
angular.module('mynewtask').controller('SignupLoginCtrl', function ($scope, $location, Auth, UserService, toaster) {

    $scope.user = {};
    $scope.new_user = {};

    $scope.userSignUp = function () {
        UserService.createUser($scope.new_user).success(function () {
            toaster.pop('success', 'User added successfully');
            $scope.new_user = {};
        }).catch(function (error) {
            toaster.pop('error', error.data.errors.email_address.message);
        });
    };

    $scope.login = function (form) {
        $scope.submitted = true;
        if (form.$valid) {
            Auth.login($scope.user).then(function () {
                $location.path('/home');
            }).catch(function (error) {
                if (error.code === 'ER_PARSE_ERROR') {
                    toaster.pop('error', 'Internal server error');
                } else {
                    toaster.pop('error', error.message);
                }
            });
        }
    };

});
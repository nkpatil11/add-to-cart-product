
'use strict';
angular.module('mynewtask').controller('SettingsCtrl', function ($scope, UserService, Auth, $location) {

    $scope.message_style = '';

    $scope.changePassword = function (form) {
        $scope.submitted = true;
        if (form.$valid) {
            UserService.changePassword($scope.user).success(function (response) {
                if (response.status === 200) {
                    $scope.message_style = 'success';
                    $scope.message = response.message;
                    setTimeout(function () {
                        $location.path('/login');
                        Auth.logout();
                    }, 2000);
                } else {
                    $scope.message_style = 'danger';
                    $scope.message = response.message;
                }
            });
        }
    };

});
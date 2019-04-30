'use strict';
angular.module('mynewtask').controller('navbarController', function ($scope, Auth, $location) {

    $scope.logout = function () {
        Auth.logout();
        $location.path('/login');
    };

    var init = function () {
        var token = Auth.isLoggedIn();
        if (!token) {
            $scope.isLoggedIn = false;
        } else {
            $scope.isLoggedIn = true;
        }
    };
    init();

});
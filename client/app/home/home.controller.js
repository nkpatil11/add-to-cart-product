'use strict';
angular.module('mynewtask').controller('mainController', function ($scope, Auth) {

    $scope.user = Auth.getCurrentUser();

});
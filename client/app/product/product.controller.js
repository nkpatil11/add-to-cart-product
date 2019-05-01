'use strict';
angular.module('mynewtask').controller('ProductCtrl', function ($scope, $modal, ProductService) {

    $scope.cart_items = [];

    $scope.getProducts = function () {
        ProductService.getAllProducts().success(function (response) {
            $scope.products = response;
        });
    };

    $scope.addToCart = function () {
        for (var i = 0; i < $scope.products.length; i++) {
            if ($scope.products[i].Selected) {
                if ($scope.cart_items.indexOf($scope.products[i]) === -1) {
                    $scope.cart_items.push($scope.products[i]);
                }
            } else {
                $scope.cart_items.splice(i, 1);
            }
        }
    };

    $scope.proceedToPay = function () {
        $modal.open({
            templateUrl: 'app/product/payment/payment.html',
            controller: 'PaymentCtrl',
            resolve: {
                aValue: function () {
                    return $scope.cart_items;
                }
            }
        });
    };

    function init() {
        $scope.getProducts();
    }

    init();
});
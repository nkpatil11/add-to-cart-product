'use strict';
angular.module('mynewtask').controller('ProductCtrl', function ($scope, config, ProductService, toaster) {

    $scope.cart_items = [];

    $scope.getProducts = function () {
        ProductService.getAllProducts().success(function (response) {
            $scope.products = response;
        });
    };

    $scope.addToCart = function () {
        $scope.cart_items = [];
        for (var i = 0; i < $scope.products.length; i++) {
            if ($scope.products[i].Selected == true) {
                if ($scope.cart_items.indexOf($scope.products[i]) === -1) {
                    $scope.cart_items.push($scope.products[i]);
                }
            } else if($scope.products[i].Selected == false) {
                $scope.cart_items.splice(i, 1);
            }
        }
    };

     $scope.totalAmount = function () {
        var sum = 0;
        for (var i = 0; i < $scope.cart_items.length; i++) {
           sum += $scope.cart_items[i].price;
        }
        return sum;
    };

    var handler = StripeCheckout.configure({
        key: config.key,
        image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
        locale: 'auto',
        token: function(token) {
            token.options = $scope.options;
            ProductService.payNow(token).success(function () {});
            toaster.pop('success', 'You successfully paid $'+ $scope.options.amount/100);
            for (var i = 0; i < $scope.products.length; i++) {
                if ($scope.products[i].Selected) {
                    $scope.products[i].Selected = false;
                    $scope.cart_items = [];
                }
            }
        }
      });

      $scope.proceedToPay = function(){
        $scope.options = {
            name: 'Payment Option',
            description: $scope.cart_items.length +' Products',
            amount: $scope.totalAmount() *100
        };
        handler.open($scope.options);
      };

    function init() {
        $scope.getProducts();
    }

    init();
});
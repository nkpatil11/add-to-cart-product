
'use strict';
var Product = require('../../api/product/product.model');
Product.find({}).remove(function () {
  Product.create(
    {
      name: "Product 1",
      price: "5",
      image: 'https://cdn.yourstory.com/wp-content/uploads/2016/07/Constructive-Feedback-1.png'
    },{
      name: "Product 2",
      price: "15",
      image: 'https://www.incimages.com/uploaded_files/image/970x450/products_364475.jpg'
    },{
      name: "Product 3",
      price: "10",
      image: 'https://landerapp.com/blog/wp-content/uploads/2018/05/MAG-FR-Oestreicher-Singer-Product-Recommendation-Viral-Marketing-Social-Media-Network-Ecommerce-1200-1200x627.jpg'
    },{
      name: "Product 4",
      price: "25",
      image: 'http://www.demo.wdmtech.com/images/stories/virtuemart/product/product_lg_type.jpg'
    },{
      name: "Product 5",
      price: "8",
      image: 'https://udemy-images.udemy.com/course/750x422/147028_d030_9.jpg'
    },{
      name: "Product 6",
      price: "6",
      image: 'https://9to5mac.com/wp-content/uploads/sites/6/2018/04/iphone-x-red.jpg?quality=82&strip=all&w=1600'
    });
});

const express = require("express");
const path = require("path");
const router = express.Router();

const sequelize = require("../models").sequelize;

router.get("/products",function(req,res,next){
    const query = "SELECT display_info.id as displayInfoId,place_name as placeName," +
        "content as productContent,description as productDescription,product.id as productId," +
        "save_file_name as productImageUrl,product.category_id as categoryId from display_info INNER JOIN product ON " +
        "display_info.product_id = product.id INNER JOIN product_image ON product.id " +
        "= product_image.product_id INNER JOIN file_info ON product_image.file_id = file_info.id " +
        "WHERE product_image.type = 'th'";
    sequelize.query(query)
    .then(([results,metadata])=>{
        results.forEach(e => {
            e.productImageUrl = path.join("images",e.productImageUrl);
        });
        res.json({"items":results,"totalCount":results.length});
    })
    .catch(err => {
        console.error(err);
    })
});

router.get("/categories",function(req,res,next){
    const query = "SELECT count(*) as count,category_id as id,category.name " +
        "from product INNER JOIN category ON product.category_id = category.id group by id";
    sequelize.query(query)
    .then(([results,metadata])=>{
        res.json({"items":results});
    })
    .catch((err)=>{
        console.error(err);
    })
});

router.get("/promotions",function(req,res,next){
    const query = "SELECT promotion.id,promotion.product_id as productID,save_file_name as productImageUrl " +
        "from promotion INNER JOIN product_image ON promotion.product_id = product_image.product_id " +
        "INNER JOIN file_info ON product_image.file_id = file_info.id " +
        "WHERE product_image.type = 'ma'";
    sequelize.query(query)
    .then(([results,metadata]) => {
        results.forEach(e => {
            e.productImageUrl = path.join("images",e.productImageUrl);
        });
        res.json({"items":results});
    })
    .catch((err)=>{
        console.error(err);
    })

});

module.exports = router;
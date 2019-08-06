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

router.get("/products/:displayInfoId",async (req,res,next) => {
    try{
        const subquery = `select product_id from display_info WHERE id=${req.params.displayInfoId}`;
        const productId = (await sequelize.query(subquery))[0][0].product_id;
        const result = {};
        const averageScoreQuery = "select AVG(score) as averageScore from product INNER JOIN " +
            "reservation_user_comment ON product.id = reservation_user_comment.product_id " +
            `WHERE product.id = ${productId}`;
        const averageScore = (await sequelize.query(averageScoreQuery))[0][0].averageScore;
        result.averageScore = averageScore;
        const commentsQuery = "select comment,reservation_user_comment.id as commentId,reservation_user_comment.create_date as " +
            "createDate,reservation_user_comment.modify_date as modifyDate,product.id as productId,reservation_date " +
            "as reservationDate,reservation_email as reservationEmail,reservation_info.id as reservationInfoId,reservation_name as " +
            "reservationName,reservation_tel as reservationTelephone,score from reservation_info INNER JOIN reservation_user_comment ON " +
            "reservation_info.id = reservation_user_comment.reservation_info_id INNER JOIN product ON reservation_user_comment.product_id " +
            `= product.id WHERE product.id = ${productId}`; 
        const comments = (await sequelize.query(commentsQuery))[0];
        const commentImagesQueryHead = "select content_type as contentType,create_date as createDate,delete_flag as deleteFlag," +
        "file_info.id as fileId,product_image.id as imageId,modify_date as modifyDate,reservation_info_id as reservationInfoId," +
        "reservation_user_comment_id as reservationUserCommentId,save_file_name as saveFileName from reservation_user_comment_image " +
        "INNER JOIN file_info ON reservation_user_comment_image.file_id = file_info.id INNER JOIN product_image ON " +
        "product_image.file_id = file_info.id";
        comments.forEach(async element => {
            const commentImagesQuery = commentImagesQueryHead + ` WHERE reservation_user_comment_id = ${element.commentId}`;
            const commentImages = (await sequelize.query(commentImagesQuery))[0];
            element.commentImages = commentImages;
        })
        result.comments = comments;
        const displayInfoQuery = "select category.id as categoryId,name as categoryName,display_info.create_date as createDate," +
            "display_info.id as displayInfoId,email,homepage,display_info.modify_date as modifyDate,opening_hours as openingHours," +
            "place_lot as placeLot,place_name as placeName,place_street as placeStreet,content as productContent,description " +
            "as productDescription,event as productEvent,product.id as productId,tel as telephone from display_info INNER JOIN " +
            "product on display_info.product_id = product.id INNER JOIN category ON category.id = product.category_id " +
            `WHERE display_info.id = ${req.params.displayInfoId}`;
        const displayInfo = (await sequelize.query(displayInfoQuery))[0][0];
        result.displayInfo = displayInfo;
        const displayInfoImageQuery = "select content_type as contentType,file_info.create_date as createDate,delete_flag as deleteFlag," +
            "display_info.id as displayInfoId,display_info_image.id as displayInfoImageId,file_info.id as fileId,file_name as fileName," +
            "file_info.modify_date as modifyDate,save_file_name as saveFileName from display_info INNER JOIN display_info_image " +
            "ON display_info.id = display_info_image.display_info_id INNER JOIN file_info ON display_info_image.file_id = file_info.id " +
            `WHERE display_info.id = ${req.params.displayInfoId}`;
        const displayInfoImage =(await sequelize.query(displayInfoImageQuery))[0][0];
        displayInfoImage.saveFileName = path.join("images",displayInfoImage.saveFileName);
        result.displayInfoImage = displayInfoImage;
        const productImagesQuery = "select content_type as contentType,create_date as createDate,delete_flag as deleteFlag," +
            "file_info.id as fileInfoId,file_name as fileName,modify_date as modifyDate,product_id as productId," +
            "product_image.id as productImageId,save_file_name as saveFileName,type from product_image INNER JOIN " +
            `file_info ON product_image.file_id = file_info.id WHERE product_id = ${productId}`;
        const productImages = (await sequelize.query(productImagesQuery))[0];
        productImages.forEach(element => {
            element.saveFileName = path.join("images",element.saveFileName);
        })
        result.productImages = productImages;
        const productPricesQuery = "select create_date as createDate,discount_rate as discountRate,modify_date as modifyDate," +
            "price,price_type_name as priceTypeName,product_id as productId,id as productPriceID from product_price " +
            `where product_id = ${productId}`;
        const productPrices = (await sequelize.query(productPricesQuery))[0];
        result.prdouctPrices = productPrices;
        res.json(result);
    }
    catch(error){
        console.error(error);
    }
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
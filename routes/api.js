const express = require("express");
const moment = require("moment-timezone");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const router = express.Router();

const sequelize = require("../models").sequelize;
const DisplayInfo = require("../models").DisplayInfo;
const ReservationEmail = require("../models").ReservationEmail;
const ReservationInfo = require("../models").ReservationInfo;
const ReservationInfoPrice = require("../models").ReservationInfoPrice;
const ReservationUserComment = require("../models").ReservationUserComment;
const ReservationUserCommentImage = require("../models").ReservationUserCommentImage;
const ProductPrice = require("../models").ProductPrice;
const FileInfo = require("../models").FileInfo;
const {validImageType} = require("../public/javascripts/common");

const uploadFolderPath = path.join(__dirname,"..","public","images","uploads");

fs.readdir(uploadFolderPath,(error)=>{
    if(error){
        fs.mkdirSync(uploadFolderPath);
    }
});


const upload = multer({
    storage: multer.diskStorage({
        destination(req,file,cb){
            cb(null,uploadFolderPath);
        },
        filename(req,file,cb){
            const ext = path.extname(file.originalname);
            cb(null,path.basename(file.originalname,ext)+new Date().valueOf() + ext);
        },
    }),
    limits: {fileSize: 5*1024*1024},
});

router.get("/products",async (req,res,next) => {
    try{
        const query = "SELECT display_info.id as displayInfoId,place_name as placeName," +
            "content as productContent,description as productDescription,product.id as productId," +
            "save_file_name as productImageUrl,product.category_id as categoryId from display_info INNER JOIN product ON " +
            "display_info.product_id = product.id INNER JOIN product_image ON product.id " +
            "= product_image.product_id INNER JOIN file_info ON product_image.file_id = file_info.id " +
            "WHERE product_image.type = 'th'";
        const results = (await sequelize.query(query))[0];
        res.json({"items":results,"totalCount":results.length});
    }
    catch(err){
        console.error(err);
    }
});

router.get("/products/:displayInfoId",async (req,res,next) => {
    try{
        const subquery = `select product_id from display_info WHERE id=${req.params.displayInfoId}`;
        const productId = (await sequelize.query(subquery))[0][0].product_id;
        const result = {};
        const averageScoreQuery = "select AVG(score) as averageScore from product INNER JOIN " +
            "reservation_user_comment ON product.id = reservation_user_comment.product_id " +
            `WHERE product.id = ${productId} AND delete_flag=0`;
        const averageScore = (await sequelize.query(averageScoreQuery))[0][0].averageScore;
        result.averageScore = averageScore;
        const commentsQuery = "SELECT comment,reservation_user_comment.id as commentId,reservation_user_comment.create_date as createDate," +
            "reservation_user_comment.modify_date as modifyDate,reservation_info.product_id as productId,reservation_date as reservationDate," +
            "email as reservationEmail,reservation_info.id as reservationInfoId,reservation_name as reservationName,reservation_tel as reservationTelephone," +
            "score from reservation_info INNER JOIN reservation_user_comment ON reservation_info.id = reservation_user_comment.reservation_info_id " +
            `INNER JOIN reservation_email ON reservation_email.id = reservation_user_comment.reservation_email_id WHERE reservation_user_comment.product_id = ${productId} ` +
            "AND delete_flag = 0"
        const comments = (await sequelize.query(commentsQuery))[0];
        const commentImagesQueryHead = "SELECT content_type as contentType,create_date as createDate,delete_flag as deleteFlag,file_info.id as fileId," +
            "reservation_user_comment_image.id as imageId,modify_date as modifyDate,reservation_info_id as reservationInfoId," +
            "reservation_user_comment_id as reservationUserCommentId,save_file_name as saveFileName FROM reservation_user_comment_image " +
            "INNER JOIN file_info ON reservation_user_comment_image.file_id = file_info.id"
        for(comment of comments){
            comment.reservationDate = moment(comment.reservationDate).format("YYYY.MM.DD.(ddd)");
            const commentImagesQuery = commentImagesQueryHead + ` WHERE reservation_user_comment_id = ${comment.commentId}` +
                " AND delete_flag = 0";
            const commentImages = (await sequelize.query(commentImagesQuery))[0];
            comment.commentImages = commentImages;
        }
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
        result.displayInfoImage = displayInfoImage;
        const productImagesQuery = "select content_type as contentType,create_date as createDate,delete_flag as deleteFlag," +
            "file_info.id as fileInfoId,file_name as fileName,modify_date as modifyDate,product_id as productId," +
            "product_image.id as productImageId,save_file_name as saveFileName,type from product_image INNER JOIN " +
            `file_info ON product_image.file_id = file_info.id WHERE product_id = ${productId}`;
        const productImages = (await sequelize.query(productImagesQuery))[0];
        result.productImages = productImages;
        const productPricesQuery = "select create_date as createDate,discount_rate as discountRate,modify_date as modifyDate," +
            "price,price_type_name as priceTypeName,product_id as productId,id as productPriceID from product_price " +
            `where product_id = ${productId}`;
        const productPrices = (await sequelize.query(productPricesQuery))[0];
        result.productPrices = productPrices;
        res.json(result);
    }
    catch(err){
        console.error(err);
    }
});

router.get("/reservations",async (req,res,next) => {
    try{
        const reservationInfoQuery = "SELECT cancel_flag as cancelYn,create_date as createDate,display_info_id as displayInfoId," +
            "modify_date as modifyDate,product_id as productId,reservation_date as reservationDate,email as reservationEmail," +
            "reservation_info.id as reservationInfoId,reservation_name as reservationName,reservation_tel as reservationTelephone " +
            "from reservation_info INNER JOIN reservation_email ON reservation_info.reservation_email_id = reservation_email.id";
        const reservationInfo = (await sequelize.query(reservationInfoQuery))[0];
        for(const element of reservationInfo){
            const totalPriceQuery = "SELECT SUM(price*count) as totalPrice from reservation_info_price INNER JOIN product_price " +
                "ON product_price.id = reservation_info_price.product_price_id INNER JOIN reservation_info ON " +
                `reservation_info_price.reservation_info_id = reservation_info.id WHERE reservation_info_id = ${element.reservationInfoId}`;
            const totalPrice = (await sequelize.query(totalPriceQuery))[0][0].totalPrice;
            element.totalPrice = totalPrice;
            const displayInfoQuery = "SELECT category.id as categoryId,category.name as categoryName,display_info.create_date as createDate," +
                "display_info.id as displayInfoId,email,homepage,display_info.modify_date as modifyDate,opening_hours as openingHours," +
                 "place_lot as placeLot,place_name as placeName,place_street as placeStreet,content as productContent,description as productDescription," +
                 "event as productEvent,product.id as productId,tel as telephone from display_info INNER JOIN product ON " +
                 "display_info.product_id = product.id INNER JOIN category ON product.category_id = category.id " +
                 `WHERE display_info.id = ${element.displayInfoId}`;
            const displayInfo = (await sequelize.query(displayInfoQuery))[0][0];
            element.displayInfo = displayInfo;
        }
        const result = {
            reservations: reservationInfo,
            size: reservationInfo.length,
        }
        res.json(result);
    }
    catch(err){
        console.error(err);
    }
});

router.post("/reservations",async (req,res,next) => {
    try{
        let postable = true;
        let message;
        const refererUrlSeparator = req.headers.referer.split("/");
        if(req.body.displayInfoId !== Number(refererUrlSeparator[refererUrlSeparator.length-1])){
            postable = false;
            message = "상품 전시 정보가 일치하지 않습니다"
        }
        const realProductId = (await DisplayInfo.findOne({
            attributes: ["product_id"],
            where:{
                id : req.body.displayInfoId
            },
        })).product_id;
        if(postable && req.body.productId !== realProductId){
            postable = false;
            message = "상품 정보가 일치하지 않습니다";
        }
        if(postable && req.body.reservationName.length === 0){
            postable = false;
            message = "예약자 이름이 존재하지 않습니다";
        }
        const emailRe = /[a-zA-Z]\w{2,}@[a-zA-Z]{3,}\.[a-zA-Z]{2,}/;
        if(postable && (req.body.reservationEmail.length === 0 || !emailRe.test(req.body.reservationEmail))){
            postable = false;
            message = "이메일 형식이 맞지 않습니다";
        }
        const telRe = /0\d{2}-[1-9]\d{2,3}-\d{4}/;
        if(postable && (req.body.reservationTelephone.length === 0 || !telRe.test(req.body.reservationTelephone))){
            postable = false;
            message = "전화번호 형식이 맞지 않습니다";
        }
        if(!postable){
            return res.status(400).send(message);
        }
        const productPriceIds = await ProductPrice.findAll({
            attributes: ["id"],
            where : {
                product_id: realProductId,
            },
         });
        let countSum = 0;
        for(priceInfo of req.body.prices){
            countSum += priceInfo.count;
            for(let i=0,len=productPriceIds.length;i<len;i++){
                if(priceInfo.productPriceId === productPriceIds[i].id){
                    break
                }
                if(i === len -1){
                    return res.status(400).send("상품 가격 정보가 맞지 않습니다");
                }
            }
        }
        if(countSum === 0){
            return res.status(400).send("상품이 선택되지 않았습니다");
        }
        res.cookie("reservationName",req.body.reservationName);
        res.cookie("reservationEmail",req.body.reservationEmail);
        res.cookie("reservationTel",req.body.reservationTelephone);
        let emailInfo = await ReservationEmail.findOne({
            where:{
                email:req.body.reservationEmail
            }
        });
        if(!emailInfo){
            emailInfo = await ReservationEmail.create({email: req.body.reservationEmail});
        }
        const creationInfo = await ReservationInfo.create({
            product_id: req.body.productId,
            display_info_id: req.body.displayInfoId,
            reservation_email_id: emailInfo.id,
            reservation_name: req.body.reservationName,
            reservation_tel: req.body.reservationTelephone,
            reservation_date: req.body.reservationYearMonthDay,
            create_date: sequelize.fn("NOW"),
            modify_date: sequelize.fn("NOW"),
        });
        for(const element of req.body.prices){
            if(element.count !== 0) {
                await ReservationInfoPrice.create({
                    reservation_info_id: creationInfo.id,
                    product_price_id: element.productPriceId,
                    count: element.count,
                });
            }
        }
        /* edwith api에 적혀있지만 목적을 모르겠음
        const reservationInfoQuery = "SELECT cancel_flag as cancelYn,create_date as createDate,display_info_id as displayInfoId," +
            "modify_date as modifyDate,product_id as productId,reservation_date as reservationDate,reservation_email as reservationEmail," +
            "id as reservationInfoId,reservation_name as reservationName,reservation_tel as reservationTelephone from reservation_info " +
            `WHERE id = ${creationInfo.id}`;
        const reservationInfo = (await sequelize.query(reservationInfoQuery))[0][0];
        const reservationInfoPriceQuery = "SELECT count,product_price_id as productPriceId,reservation_info_id as reservationInfoId," +
            `id as reservationInfoPriceId from reservation_info_price WHERE reservation_info_id = ${creationInfo.id}`;
        const reservationInfoPrice = (await sequelize.query(reservationInfoPriceQuery))[0];
        reservationInfo.prices = reservationInfoPrice;
        */
        res.status(201).send();
    }
    catch(err) {
        console.error(err);
    }
});

router.put("/reservations/:reservationInfoId",async (req,res,next) => {
    try{
        const exReservation = await ReservationInfo.findOne({
            where: {
                id: req.params.reservationInfoId,
                reservation_email_id: req.user.id,
            }
        });
        if(!exReservation){
            return res.status(400).send();
        }
        await ReservationInfo.update({
            cancel_flag: 1,
            modify_date: sequelize.fn("NOW"),
        },{
            where: {id:req.params.reservationInfoId},
        });
        /*
        const reservationInfoQuery = "SELECT cancel_flag as cancelYn,create_date as createDate,display_info_id as displayInfoId," +
            "modify_date as modifyDate,product_id as productId,reservation_date as reservationDate,reservation_email as reservationEmail," +
            "id as reservationInfoId,reservation_name as reservationName,reservation_tel as reservationTelephone from reservation_info " +
            `WHERE id = ${req.params.reservationInfoId}`;
        const reservationInfo = (await sequelize.query(reservationInfoQuery))[0][0];
        const reservationInfoPriceQuery = "SELECT count,product_price_id as productPriceId,reservation_info_id as reservationInfoId," +
            `id as reservationInfoPriceId from reservation_info_price WHERE reservation_info_id = ${req.params.reservationInfoId}`;
        const reservationInfoPrice = (await sequelize.query(reservationInfoPriceQuery))[0];
        reservationInfo.prices = reservationInfoPrice;
        res.json(reservationInfo);
        */
        res.status(201).send();
    }
    catch(err){
        console.error(err);
    }
});


router.post("/reservations/:reservationInfoId/comments",upload.single("image"),async (req,res,next) => {
    try{
        let postable = true;
        let message;
        const exReservation = await ReservationInfo.findOne({
            where: {
                id: req.params.reservationInfoId,
                reservation_email_id: req.user.id
            }
        })
        if(!exReservation || new Date(exReservation.reservation_date) > new Date()){
            postable = false;
            message = "잘못된 접근입니다"
        }
        const exComment = await ReservationUserComment.findOne({
            where: {
                reservation_info_id: Number(req.params.reservationInfoId),
                delete_flag: 0,
            }
        });
        if(postable && exComment){
            postable = false;
            message = "한 공연당 하나의 리뷰만 입력할 수 있습니다";    
        }
        if(postable && (Number(req.body.score) <= 0 || Number(req.body.score) > 5 || !Number.isInteger(Number(req.body.score)))){
            postalbe = false;
            message = "별점 개수가 올바르지 않습니다"
        }
        if(postable && (req.body.comment.length < 5 || req.body.comment.length > 400)){
            postable = false;
            message = "리뷰 글자수가 맞지 않습니다."
        }
        if(postable && (req.file && !validImageType(req.file.mimetype))){
            postable = false;
            message = "이미지는 jpg,jpeg,png 파일만 가능합니다"
        }
        if(!postable){
            if(req.file){
                fs.unlink(req.file.path,(error)=>{
                    if(error){
                        console.error(error);
                    }
                });
            }
            return res.status(400).send(message);
        }
        const commentCreationInfo = await ReservationUserComment.create({
            product_id: exReservation.product_id,
            reservation_info_id: Number(req.params.reservationInfoId),
            reservation_email_id: req.user.id,
            score: Number(req.body.score),
            comment: req.body.comment,
            create_date: sequelize.fn("NOW"),
            modify_date: sequelize.fn("NOW"),
        });
        if(req.file){
            const fileCreationInfo = await FileInfo.create({
                file_name: req.file.filename,
                save_file_name: `images/uploads/${req.file.filename}`,
                content_type: req.file.mimetype,
                delete_flag: 0,
                create_date: sequelize.fn("NOW"),
                modify_date: sequelize.fn("NOW"),
            });
            await ReservationUserCommentImage.create({
                reservation_info_id: commentCreationInfo.reservation_info_id,
                reservation_user_comment_id: commentCreationInfo.id,
                file_id: fileCreationInfo.id,
            });
        }
        res.status(201).send();
    }
    catch(error){
        console.error(error);
    }
});

router.delete("/reservations/comments/:commentId",async (req,res,next) =>{
    try{
        if(!req.isAuthenticated()){
            return res.status(400).send("로그인 하세요");
        }
        const exComment = await ReservationUserComment.findOne({
            where: {
                id: req.params.commentId,
                reservation_email_id: req.user.id
            }
        })
        if(!exComment){
            return res.status(400).send("리뷰 정보와 회원 정보가 일치하지 않습니다");
        }
        ReservationUserComment.update({
            modify_date: sequelize.fn("NOW"),
            delete_flag: 1,
        },{
            where: {
                id: req.params.commentId,
                reservation_email_id: req.user.id,
            }
        });
        res.status(201).send();
    }
    catch(error){
        console.error(error);
    }
});

router.put("/reservations/comments/:commentId",upload.single("image"),async (req,res,next) =>{
    try{
       let postable = true;
       let message;
       if(!req.isAuthenticated()){
            return res.status(400).send("로그인 하세요");
        }
       const exComment = await ReservationUserComment.findOne({
           where: {
               id: Number(req.params.commentId),
               reservation_email_id: req.user.id,
               delete_flag: 0,
           }
       });
       if(!exComment){
           postable = false;
           message = "기존에 등록된 리뷰가 없습니다";    
       }
       if(postable && (Number(req.body.score) <= 0 || Number(req.body.score) > 5 || !Number.isInteger(Number(req.body.score)))){
           postalbe = false;
           message = "별점 개수가 올바르지 않습니다"
       }
       if(postable && (req.body.comment.length < 5 || req.body.comment.length > 400)){
           postable = false;
           message = "리뷰 글자수가 맞지 않습니다."
       }
       if(postable && (req.file && !validImageType(req.file.mimetype))){
           postable = false;
           message = "이미지는 jpg,jpeg,png 파일만 가능합니다"
       }
       if(!postable){
           if(req.file){
               fs.unlink(req.file.path,(error)=>{
                   if(error){
                       console.error(error);
                   }
               });
           }
           return res.status(400).send(message);
       }
        await ReservationUserComment.update({
           score: Number(req.body.score),
           comment: req.body.comment,
           modify_date: sequelize.fn("NOW"),
        },
        {
           where:{
                id: Number(req.params.commentId),
                reservation_email_id: req.user.id,
                delete_flag: 0,
           }
       });
       console.log("exImage는",req.body.exImage);
       console.log("newImage는",req.body.newImage);
       if(req.body.exImage && req.body.newImage !== 0){
           // 파일 삭제
           // 기존에 이미지가 존재하면서 추가하였거나 제거한 경우
           const exImages = await ReservationUserCommentImage.findAll({
                where: {
                    reservation_user_comment_id: Number(req.params.commentId),
                } 
            });
            for(const image of exImages){
                if(!image.delete_flag){
                    const updateInfo = await FileInfo.update({
                        delete_flag: 1,
                        modify_date: sequelize.fn("NOW"), 
                    },{
                        where: {
                            id: image.file_id,
                        }
                    });
                    const toDeleteFile = await FileInfo.findOne({
                        where: {
                            id:image.file_id,
                        }
                    });
                    fs.unlink(path.join(__dirname,"..","public",toDeleteFile.save_file_name),(error)=>{
                        if(error){
                            console.error(error);
                        }
                    });
                }
            }
       }
       if(req.file){
           const fileCreationInfo = await FileInfo.create({
               file_name: req.file.filename,
               save_file_name: `images/uploads/${req.file.filename}`,
               content_type: req.file.mimetype,
               delete_flag: 0,
               create_date: sequelize.fn("NOW"),
               modify_date: sequelize.fn("NOW"),
           });
           const commentInfo = await ReservationUserComment.findOne({
                where:{
                    id: Number(req.params.commentId),
                    reservation_email_id: req.user.id,
                    delete_flag: 0,
                }
           });
           await ReservationUserCommentImage.create({
               reservation_info_id: commentInfo.reservation_info_id,
               reservation_user_comment_id: commentInfo.id,
               file_id: fileCreationInfo.id,
           });
       }
       res.status(201).send();
    }
    catch(error){
        console.error(error);
    }
});

router.get("/categories",async (req,res,next) => {
    try{
        const query = "SELECT count(*) as count,category_id as id,category.name " +
            "from product INNER JOIN category ON product.category_id = category.id group by id";
        const results = (await sequelize.query(query))[0];
        res.json({"items":results});    
    }
    catch(err){
        console.error(err);
    }
});

router.get("/promotions",async (req,res,next) => {
    try{
        const query = "SELECT promotion.id,promotion.product_id as productID,save_file_name as productImageUrl " +
            "from promotion INNER JOIN product_image ON promotion.product_id = product_image.product_id " +
            "INNER JOIN file_info ON product_image.file_id = file_info.id " +
            "WHERE product_image.type = 'ma'";
        const results = (await sequelize.query(query))[0];
        res.json({"items":results});
    }
    catch(err){
        console.error(err);
    }
});

module.exports = router;


const express = require("express");
const path = require("path");
const http = require("http");
const moment = require("moment-timezone");
const {isLoggedIn} = require("./middlewares");
const {transformMoneyUnit,priceTypeMapper} = require("../public/javascripts/common");

const sequelize = require("../models").sequelize;
const router = express.Router();


router.get("/",isLoggedIn,async (req,res,next) => {
    try{
        const emailId = req.user.id;  
        const reservationInfoQuery = "SELECT reservation_info.id as reservationInfoId,reservation_date as reservationDate,description," +
            "reservation_name as reservationName,reservation_tel as reservationTel,place_name as placeName,cancel_flag as cancelFlag,product.id as productId," +
            "SUM(price*count) as totalPrice from reservation_info INNER JOIN display_info ON reservation_info.display_info_id = display_info.id " +
            "INNER JOIN product ON reservation_info.product_id = product.id INNER JOIN reservation_info_price ON " +
            "reservation_info.id = reservation_info_price.reservation_info_id INNER JOIN product_price ON " +
            `product_price.id = reservation_info_price.product_price_id WHERE reservation_info.reservation_email_id = ${emailId} ` +
            "GROUP BY reservation_info.id";
        const reservationInfo = (await sequelize.query(reservationInfoQuery))[0];
        const toUsedReservation = [];
        const usedReservation = [];
        const canceledReservation = [];
        for(const eachReservation of reservationInfo){
            const priceInfoQuery = "SELECT price,price_type_name as priceTypeName,count from product_price INNER JOIN " +
                "reservation_info_price ON product_price.id = reservation_info_price.product_price_id INNER JOIN reservation_info ON " +
                `reservation_info_price.reservation_info_id = reservation_info.id WHERE reservation_info.id = ${eachReservation.reservationInfoId}`;
            const priceInfo = (await sequelize.query(priceInfoQuery))[0];
            eachReservation.priceInfo = priceInfo;
            eachReservation.reservationDate = moment(eachReservation.reservationDate).format("YYYY.MM.DD.(ddd)");
            if(eachReservation.cancelFlag){
                canceledReservation.push(eachReservation);
            }
            else if(new Date(eachReservation.reservationDate) <= new Date()){
                usedReservation.push(eachReservation);
            }
            else{
                toUsedReservation.push(eachReservation);
            }
        }
        res.render("myReservation",{
            length: reservationInfo.length,
            toUsed: toUsedReservation,
            used: usedReservation,
            canceled: canceledReservation,
            transformMoneyUnit: transformMoneyUnit,
            priceTypeMapper: priceTypeMapper,
        });
    }
    catch(err){
        console.error(err);
    }
});


module.exports = router;
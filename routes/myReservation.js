const express = require("express");
const path = require("path");
const http = require("http");

const sequelize = require("../models").sequelize;
const router = express.Router();


router.get("/:emailId",async (req,res,next) => {
    // 페이지 확인하려고 임시로 만들어둠
    try{
         /*
    if(!req.isAuthenticated()){
        return res.redirect("/bookinglogin");
    }
    */
        const emailId = req.params.emailId;  // 본래는 req.user.id를 사용해야 함;
        const reservationInfoQuery = "SELECT reservation_info.id as reservationInfoId,reservation_date as reservationDate,description," +
            "reservation_name as reservationName,reservation_tel as reservationTel,place_name as placeName,cancel_flag as cancelFlag," +
            "SUM(price*count) as totalPrice from reservation_info INNER JOIN display_info ON reservation_info.display_info_id = display_info.id " +
            "INNER JOIN product ON reservation_info.product_id = product.id INNER JOIN reservation_info_price ON " +
            "reservation_info.id = reservation_info_price.reservation_info_id INNER JOIN product_price ON " +
            `product_price.id = reservation_info_price.product_price_id WHERE reservation_info.reservation_email_id = ${emailId} ` +
            "GROUP BY reservation_info.id";
        const reservationInfo = (await sequelize.query(reservationInfoQuery))[0];
        for(const eachReservation of reservationInfo){
            const priceInfoQuery = "SELECT price,price_type_name as priceTypeName,count from product_price INNER JOIN " +
                "reservation_info_price ON product_price.id = reservation_info_price.product_price_id INNER JOIN reservation_info ON " +
                `reservation_info_price.reservation_info_id = reservation_info.id WHERE reservation_info.id = ${eachReservation.reservationInfoId}`;
            const priceInfo = (await sequelize.query(priceInfoQuery))[0];
            eachReservation.priceInfo = priceInfo;
        }
        res.render("myReservation");
    }
    catch(err){
        console.error(err);
    }
});


module.exports = router;
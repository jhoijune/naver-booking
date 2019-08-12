const express = require("express");
const path = require("path");
const http = require("http");
const router = express.Router();

router.get("/",function(req,res,next){
    /*req.query.reserve_email
    myReservation where email로 빼오고

        전체 이용예정 이용완료 취소 환불
        
        No. - reservationId
        서비스명/상품명 product.description
        일정 ? reservation_date로 해야하는지 아니면 display_info.opening_hours로 해야하는지
        내역
        장소
        업체
        결제 예정금액
        
        
        SELECT reservation_info.id,product.description,display_info.place_name
    */
});


module.exports = router;
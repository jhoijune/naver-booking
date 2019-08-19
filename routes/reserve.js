const express = require("express");
const http = require("http");
const router = express.Router();
const moment = require("moment-timezone");
const {transformMoneyUnit,priceTypeMapper} = require("../public/javascripts/common");
moment.locale("ko");

router.get("/:displayInfoId",function(req,res,next){
    const request = http.request({
        host: 'localhost',
        port: process.env.PORT,
        path: `/api/products/${req.params.displayInfoId}`,
        method: 'GET',
      }, response => {
        let data = '';
        response.on('data', (chunk) => {
          data += chunk;
        });
        response.on('end', () => {
            data = JSON.parse(data);
            const diffDays = {
                reserve: Math.floor(Math.random()*5 +1),
            }
            diffDays.start = diffDays.reserve - Math.floor(Math.random()*5 +1);
            diffDays.end = diffDays.reserve + Math.floor(Math.random()*5 +1);
            const reservationDate = moment().tz("Asia/Seoul").add(diffDays.reserve,"days"); 
            const startDate = moment().tz("Asia/Seoul").add(diffDays.start,"days"); 
            const endDate = moment().tz("Asia/Seoul").add(diffDays.end,"days"); 
            res.render("reserve",{
                data: data,
                cookies: Object.keys(req.cookies).length !== 0 ? req.cookies : null,
                priceTypeMapper: priceTypeMapper,
                transformMoneyUnit: transformMoneyUnit,
                reservationDate: reservationDate.format("YYYY.MM.DD HH:mm:ss"),
                startDate: startDate.format("YYYY.MM.DD.(ddd)"),
                endDate: endDate.format("YYYY.MM.DD.(ddd)"),
            });
        });
      });
      request.end();
});

module.exports = router;
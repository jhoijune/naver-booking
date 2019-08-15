const express = require("express");
const http = require("http");
const router = express.Router();
const moment = require("moment-timezone");

function transformMoneyUnit(num){
    let transformed = "";
    num = num.toString();
    const numLen = num.length;
    for(let i = 1 ; i <= numLen ; i++){ 
        if(i>3 && i % 3 === 1){
            transformed = "," + transformed;
        }
        transformed = num.charAt(numLen - i) + transformed;
    }
    return transformed
}

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
            res.locals.data = data;
            priceTypeMapper = {
                A: "성인",
                Y: "청소년",
                B: "유아",
                S: "셋트",
                D: "장애인",
                C: "지역주민",
                E: "어얼리버드",
                V: "VIP",
                R: "R석",
                B: "B석",
                S: "S석",
                D: "평일",
            };
            res.locals.priceTypeMapper = priceTypeMapper;
            res.locals.transformMoneyUnit = transformMoneyUnit;
            const date = moment();
            date.add(Math.floor(Math.random()*5+1),"days");
            res.locals.reservationDate = date.format("YYYY-MM-DD HH:mm:ss");
            res.render("reserve");
        });
      });
      request.end();
});

module.exports = router;
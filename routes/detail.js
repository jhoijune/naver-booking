const express = require("express");
const path = require("path");
const http = require("http");
const router = express.Router();

const sequelize = require("../models").sequelize;
const DisplayInfo = require("../models").DisplayInfo;

router.get("/",function(req,res,next){
    DisplayInfo.findOne({
        attributes: ['id'],
        where: {
            product_id: req.query.productID
        },
    })
    .then(result => res.redirect(`detail/${result.id}`));
});

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
            res.render("detail");
        });
      });
      request.end();
});


module.exports = router;
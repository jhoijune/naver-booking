const express = require("express");
const path = require("path");
const http = require("http");
const router = express.Router();

const sequelize = require("../models").sequelize;
const DisplayInfo = require("../models").DisplayInfo;
const {isLoggedIn} = require("./middlewares");
const {priceTypeMapper} = require("../public/javascripts/common");

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
            email = req.isAuthenticated() ? req.user.email : null
            res.render("detail",{
                data: data,
                email: email,
                priceTypeMapper: priceTypeMapper,
            });
        });
      });
      request.end();
});


module.exports = router;
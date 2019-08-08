const express = require("express");
const path = require("path");
const http = require("http");
const router = express.Router();

const sequelize = require("../models").sequelize;
const DisplayInfo = require("../models").DisplayInfo;


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
            res.render("review");
        });
      });
      request.end();
});


module.exports = router;
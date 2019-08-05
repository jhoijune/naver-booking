const express = require("express");
const path = require("path");
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
    res.json();
});

module.exports = router;
const express = require("express");
const http = require("http");
const router = express.Router();

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
            res.render("review",{
              data: data,
            });
        });
      });
      request.end();
});


module.exports = router;
const express = require("express");
const path = require("path");
const router = express.Router();

router.get("/", (req, res, next) => {
    // 여기서 로그인중이면 {id or login} 바꿔야함
    res.render("mainpage",{
        user: req.user | null,
    });
});

router.get("/bookinglogin",(req,res,next)=>{
    // 여기에서 로그인 중이면 이미 로그인됐다고 알리고 메인페이지로 보내야 함
    res.render("bookingLogin");
})

module.exports = router;

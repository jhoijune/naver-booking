const express = require("express");
const {isLoggedIn} = require("./middlewares");
const router = express.Router();

router.get("/:productId",isLoggedIn,(req,res,next) =>{
    // 로그인 상태면서 해당 사용자가 예매를 했으며 시간이 지나야
    // 렌더할 수 있게
    res.render("reviewWrite");
})


module.exports = router;
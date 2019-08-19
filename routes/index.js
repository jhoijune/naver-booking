const express = require("express");
const path = require("path");
const router = express.Router();

const {isNotLoggedIn} = require("./middlewares");




router.get("/", (req, res, next) => {
    email = req.isAuthenticated() ? req.user.email : null
    res.render("mainpage",{
        email: email
    })
});


router.get("/bookinglogin",isNotLoggedIn,(req,res,next)=>{
    res.render("bookingLogin",{
        flashMessage: res.locals.loginError
    });
})

module.exports = router;

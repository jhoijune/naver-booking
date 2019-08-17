const express = require("express");
const passport = require("passport");
const {reservationEmail} = require("../models");

const router = express.Router();

router.post("/login",(req,res,next)=>{
    passport.authenticate("local",(authError,user,info)=>{
        if(authError){
            console.error(authError);
            return next(authError);
        }
        if(!user){
            req.flash("loginError",info.message);
            return res.redirect("bookinglogin.html");
        }
        return req.login(user,(loginError)=>{
            if(loginError){
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect("myreservation");
        });
    })(req,res,next);
});

module.exports = router;
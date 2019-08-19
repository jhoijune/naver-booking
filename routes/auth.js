const express = require("express");
const passport = require("passport");

const router = express.Router();

router.post("/login",(req,res,next)=>{
    passport.authenticate("local",(authError,user,info)=>{
        if(authError){
            console.error(authError);
            return next(authError);
        }
        if(!user){
            res.locals.loginError = "예약이 등록되지 않은 회원입니다";
            return res.redirect("../bookinglogin");
        }
        return req.login(user,(loginError)=>{
            if(loginError){
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect("../myreservation");
        });
    })(req,res,next);
});

router.get("/logout",(req,res,next) => {
    req.logout();
    req.session.destroy();
    res.redirect("/");
});

module.exports = router;
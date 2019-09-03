const {ReservationEmail} = require("../models");


exports.isLoggedIn = (req,res,next) => {
    if(req.isAuthenticated()){
        next()
    }
    else{
        res.redirect("/bookinglogin");
    }
}

exports.isNotLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        next();
    }
    else{
        res.redirect("/");
    }
}

exports.confirmAPIRequest = (req,res,next) =>{
    function checkIP(){
        let ip = req.ip;
        if (ip.substr(0, 7) == "::ffff:") {
            ip = ip.substr(7)
        }
        return ip === "::1" || ip === "127.0.0.1";
    }
    if(req.xhr || checkIP() || (req.user && req.user.is_admin)){
        next();
    }
    else{
        res.redirect("/");
    }
}
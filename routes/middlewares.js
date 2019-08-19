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
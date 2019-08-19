const LocalStrategy = require("passport-local").Strategy;

const {ReservationEmail} = require("../models");

module.exports = (passport) =>{
    passport.use(new LocalStrategy({
        usernameField: "email",
        passwordField: "email"
    },async (email,password,done) =>{
        try{
            console.log("나의",email);
            const exUser = await ReservationEmail.findOne({where:{email:email}});
            if(exUser){
                done(null,exUser);
            }
            else{
                done(null,false,{message:"예약이 등록되지 않은 이메일입니다."});
            }
        }
        catch(error){
            console.error(error);
            done(error);
        }
    }));
};

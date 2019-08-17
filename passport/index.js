const local = require("./localStrategy");
const {ReservationEmail} = require("../models");

module.exports = (passport) =>{
    passport.serializeUser((user,done) => {
        done(null,user.id);
    });

    passport.deserializeUser((id,done)=>{
        ReservationEmail.findOne({where:{id}})
        .then(user => done(null,user))
        .catch(err => done(err));
    });
}
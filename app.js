const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
require('dotenv').config();

const apiRouter = require('./routes/api');
const detailRouter = require('./routes/detail');
const reviewRouter = require('./routes/review');
const sequelize = require('./models').sequelize;

const app = express();
sequelize.sync();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('port', process.env.PORT || 8001);


if(process.env.NODE_ENV === "production"){
    app.use(morgan('combined'));
}
else{
    app.use(morgan('dev'));
}
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
const sessionOption = {
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
};
if(process.env.NODE_ENV === "production"){
    sessionOption.proxy = true;
    //sessionOption.cookie.secure = true;
}
app.use(session(sessionOption));
app.use(flash());

app.use("/api",apiRouter);
app.use("/detail",detailRouter);
app.use("/review",reviewRouter);

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기중');
});

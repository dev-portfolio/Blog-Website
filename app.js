var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('hbs');
var session = require("express-session");
var  flash = require('connect-flash');
var passport = require('passport');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var multeringrouter = require ('./routes/multering');
var mongoose=require('mongoose');
var bodyparser = require('body-parser');
var path = require ('path');
var methodoverride = require('method-override');
var app = express();


// Map global promise - get rid of warning
mongoose.Promise = global.Promise;

//importing DB for
var db = require('./config/database');
// Connect to mongoose
mongoose.connect(db.mongoURI)
    .then(function() { console.log('MongoDB Connected...')})
    .catch(function( err ){ console.log(
        err)});


//Middleware For File Uploading
app.use(bodyparser.json());
app.use(methodoverride('_method'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(__dirname + '/views/partial');
app.set('view engine', 'hbs');

//Session Middleware
app.use(session({
    secret: 'cats',
    resave: true,
    saveUninitialized: true,

}));
//Flash Middleware
app.use(flash());


//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Flash Local Variables (Category of Middlwares)
app.use(function(req, res, next)
{
    res.locals.success_msg = req.flash('success_msg') ;
    res.locals.error_msg =   req.flash('error_msg');
    res.locals.error =       req.flash('error');
    res.locals.errors2 =      req.flash('errors2');
    res.locals.user = req.user ||null;
    console.log(res.locals.user);
    next();
});


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/multi', multeringrouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

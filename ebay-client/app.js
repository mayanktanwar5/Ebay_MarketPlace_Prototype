var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var amqp = require('amqplib/callback_api');
var routes = require('./routes/index');
var users = require('./routes/users');
var mongoSessionConnectURL = "mongodb://localhost:27017/ebay";
var expressSession = require("express-session");
var mongoStore = require("connect-mongo")(expressSession);

var user = require('./routes/user');
var sell = require('./routes/sell');
var buy = require('./routes/buy');
var flash=require('connect-flash');
require('./routes/passport')(passport);

//var logger1 = require("./logger/logger");
var app = express();


app.use(expressSession({
  secret: 'cmpe273_teststring',
  resave: false,  //don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  duration: 30 * 60 * 1000,    
  activeDuration: 5 * 60 * 1000,
  store: new mongoStore({
    url: mongoSessionConnectURL
  })
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/userHomepage',user.canRedirectToHomepage);
app.post('/sell',sell.newAdvertise);
app.post('/signup', user.registerUser);
// app.post('/login',passport.authenticate('local'),user.loginUser);
app.post('/login',user.loginUser);
app.post('/logout',user.logout);
app.post('/createProfile',user.createProfile);
app.post('/alladvertise',sell.alladvertise);
app.post('/bid',sell.bid);
app.post('/myBids',sell.myBids);
app.post('/addToCart',buy.addToCart);
app.get('/showCart',buy.showCart);
app.post('/removeCartItem',buy.removeCartItem);
app.post('/allcart',buy.allCart);
app.post('/buyItem',buy.buyItem);
app.post('/getItem',buy.getItem);
app.post('/profile',user.profile);
app.post('/allBought',user.allBought);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;




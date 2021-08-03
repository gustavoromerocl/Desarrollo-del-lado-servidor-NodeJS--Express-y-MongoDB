/*
 npm install express-session
*/
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('./config/passport');
const session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/usuarios');
var bicicletasRouter = require('./routes/bicicletas');
var tokenRouter = require('./routes/token');
var bicicletasAPIRouter = require('./routes/api/bicicletas');
var usuariosAPIRouter = require('./routes/api/usuarios');

//Persistencia en la memoria del servidor
const store = new session.MemoryStore;

var app = express();
app.use(session({
  cookie: {maxAge: 240 * 60 * 60 * 1000},
  store: store,
  saveUninitialized: true,
  resave: 'true',
  secret: 'red_bicicletas!!!---1234*'
}))


var mongoose = require('mongoose');

var mongoDB = 'mongodb://localhost/red_bicicletas';
mongoose.connect(mongoDB, { useUnifiedTopology: true, useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error: '));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

app.get('/login', function(req, res) {
  res.render('session/login');
});

app.post('/login', function(req,res, next){
  passport.authenticate('local', function(err, usuario, info){
    if (err) return next(err);
    if (!usuario) return res.render('session/login', {info})
    req.logIn(usuario, function(err){
      if(err) next(err);
      return res.redirect('/');
    });
  })(req, res, next);
});

app.get('/logout', function(req, res){
  req.logOut();
  res.redirect('/');
});

app.get('/forgotPassword', function(req, res){

});

app.post('/forgotPassword', function(req, res){

});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/usuarios', usersRouter);
app.use('/bicicletas', bicicletasRouter);
app.use('/api/bicicletas', bicicletasAPIRouter);
app.use('/api/usuarios', usuariosAPIRouter);
app.use('/token', tokenRouter);


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

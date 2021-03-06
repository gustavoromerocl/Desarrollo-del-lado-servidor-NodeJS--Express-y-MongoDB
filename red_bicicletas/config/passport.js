/*
http://www.passportjs.org/
*/

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookTokenStrategy = require('passport-facebook-token');

const Usuario = require('../models/usuario');

passport.use(new LocalStrategy(
    { 
        usernameField: 'email',    // define the parameter in req.body that passport can use as username and password
        passwordField: 'password'
    },
    function(email, password, done){
        //we search the user by his/her email
        Usuario.findOne({email: email}, (err, usuario)=>{
            //If there is a error
            if(err) return done(err)
            //If there is not user with that email
            if(!usuario) return done(null, false, {message: 'Email no existente o incorrecto'});
            //Is password is not valid
            if (!usuario.validPassword(password)) return done(null, false, {message: 'Password incorrecto'});

            //Everthing is OK. Execute the callaback
            return done(null, usuario)
        })
    }
));

passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.HOST + "/auth/google/callback",
      },
      function (accessToken, refreshToken, profile, cb) {
        //find the user if doesnt exist create it
        Usuario.findOneOrCreateByGoogle(profile, function (err, user) {
          console.log("profile", profile);
          console.log("profile", profile.emails);
          return cb(err, user);
        });
      }
    )
);

//FACEBOOK AUTH
passport.use(new FacebookTokenStrategy({
  clientID: process.env.FACEBOOK_ID,
  clientSecret: process.env.FACEBOOK_SECRET,
  fbGraphVersion: 'v3.0'
  }, function (accessToken, refreshToken, profile, done) {
    console.log("FaceToken--profile", profile);
    Usuario.findOneOrCreateByFacebook(profile, function (err, user) {
      if (err) {
        return done(err);
      }
      done(null, user);
    });
}));

//serialize the id of User
passport.serializeUser(function (user, cb) {
    cb(null, user.id);
  });


//get of User by their ID
passport.deserializeUser(function(id, cb){
    Usuario.findById(id, (err, usuario)=>{
        cb(err, usuario)
    });
});

module.exports = passport;
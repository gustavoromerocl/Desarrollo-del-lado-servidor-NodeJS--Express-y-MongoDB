/*
npm install bcrypt --save
npm install mongoose-unique-validator --save
*/
const mongoose = require('mongoose');
const Reserva = require('./reserva');
const Token = require('./token');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const mailer = require('../mailer/mailer');
const uniqueValidator = require('mongoose-unique-validator');

const saltRounds = 10;

const validateEmail = function(email){
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
}

const usuarioSchema = new Schema({
    nombre: {
        type: String,
        trim: true,
        required: [true, 'El nombre es obligatorio']
    },
    email: {
        type: String,
        trim: true,
        required: [true, 'El email es obligatorio'],
        lowerCase: true,
        unique: true,
        validate: [validateEmail, 'Por favor ingrese un email valido'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
    },
    password: {
        type: String,
        required: [true, 'El password es obligatorio']
    },
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    verificado: {
        type: Boolean,
        default: false
    },
    googleId: String,
    facebookId: String
});

usuarioSchema.plugin(uniqueValidator, {message: 'El {PATH} ya existe con otro usuario'})

//Ejecuta un callback antes del metodo save
usuarioSchema.pre('save', function(next){
    if(this.isModified('password')){
        this.password = bcrypt.hashSync(this.password, saltRounds);
    };
    next();
})

usuarioSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password);
}

usuarioSchema.methods.reservar =  function(biciId, desde, hasta, cb){
    const reserva = new Reserva({usuario: this._id, bicicleta: biciId, desde: desde, hasta: hasta})
    console.log(reserva);
    reserva.save(cb);
}

const uri = process.env.NODE_ENV === "production" ? 'https://noderedbicicletas.herokuapp.com' : `localhost:${process.env.PORT}`;

usuarioSchema.methods.enviar_email_bienvenida = function(cb) {
    const token = new Token({_userId: this.id, token: crypto.randomBytes(16).toString('hex')})
    const email_destination = this.email;
    token.save((err) => {
      if ( err ) { return console.log(err.message)}
      const mailOptions = {
        from: 'gandresrp@gmail.com',
        to: email_destination,
        subject: 'Verificacion de cuenta',
        text: 'Hola,\n\n' 
        + 'Por favor, para verificar su cuenta haga click en este link: \n' 
        + `${uri}`
        + '\/token/confirmation\/' + token.token + '\n'
      }
  
      mailer.sendMail(mailOptions, function(err){
        if( err ) { return console.log(err.message) } 
        console.log('Se ha enviado un email de bienvenida a: ' + email_destination)
      });
    });
};

usuarioSchema.methods.resetPassword =  function(cb){
    const token = new Token({_userId: this.id, token: crypto.randomBytes(16).toString('hex')});
    const email_destination = this.email;
     token.save(function (err) {
      if (err) {return cb(err)}
      const mailOptions = {
        from: 'gandresrp@gmail.com',
        to: email_destination,
        subject: 'Reseteo de password de cuenta',
        text: 'Hola,\n\n' 
        + 'Por favor, para resetar el password de su cuenta haga click en este link: \n' 
        + `${uri}`
        + '\/resetPassword\/' + token.token + '\n'
      }
       mailer.sendMail(mailOptions, function(err){
        if( err ) { return cb(err) } 
        console.log('Se ha enviado un email para resetar el password a: ' + email_destination)
      })
    cb(null);
  })
}

//Method of AuthO Note contidition is the user
usuarioSchema.statics.findOneOrCreateByGoogle = function findOneOrCreate(
  condition,
  cb
) {
  const self = this;//is use to don't loose the ref to the user in the other callback
  console.log("user",condition);
  console.log("emails",condition.emails);
  self.findOne(
    {
      $or: [{ googleId: condition.id }, { email: condition.emails[0].value }],
    },
    (err, result) => {
      if (result) {// if user exist 
        cb(err, result);//execute the callback with the user
      } else { //success
        let values = {};
        values.id = condition.id;
        values.email = condition.emails[0].value;
        values.nombre = condition.displayName || "Sin nombre";
        values.verificado = true;
        values.password = condition.emails[0].value + "pass";// improve this 

        //we create the user
        self.create(values, (err, result) => {
          if (err) {
            console.log(err);
          }
          return cb(err, result);
        });
      }
    }
  );
}

usuarioSchema.statics.findOneOrCreateByFacebook = function findOneOrCreate(condition, callback) {
  const self = this;
  console.log("condition",condition);
  self.findOne({
      $or: [
          { 'facebookId': condition.id }, { 'email': condition.emails[0].value }
      ]
  }).then((result) => {
      if (result) {
          callback(null,result);
      } else {
          console.log('---------------- CONDITION ------------------');
          console.log(condition);
          var values = {}
          values.facebookId = condition.id;
          values.email = condition.emails[0].value;
          values.nombre = condition.displayName || 'SIN NOMBRE';
          values.verificado = true;
          values.password = crypto.randomBytes(16).toString('hex');
          console.log('---------------- VALUES----------------------');
          console.log(values);

          self.create(values)
              .then((result) => {
                  return callback(null,result);
              })
              .catch((err) => {
                console.log(err);
                return callback(err);
              })
      }
  }).catch((err) => {
      callback(err);
      console.error(err);
  })
}

module.exports = mongoose.model('Usuario', usuarioSchema);
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
    }
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

const uri = process.env.NODE_ENV === "production" ? 'https://noderedbicicletas.herokuapp.com' : 'http://localhost:3000';

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

module.exports = mongoose.model('Usuario', usuarioSchema);
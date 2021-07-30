const mongoose = require('mongoose');
const Reserva = require('./reserva');
const Schema = mongoose.Schema;

const usuarioSchema = new Schema({
    nombre: String
})

usuarioSchema.methods.reservar =  function(biciId, desde, hasta, cb){
    const reserva = new Reserva({usuario: this._id, bicicleta: biciId, desde: desde, hasta: hasta})
    console.log(reserva);
    reserva.save(cb);
}

module.exports = mongoose.model('Usuario', usuarioSchema);
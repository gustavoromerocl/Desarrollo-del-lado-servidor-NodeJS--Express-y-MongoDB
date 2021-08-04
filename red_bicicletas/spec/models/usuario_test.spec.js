const mongoose = require('mongoose');
const Bicicleta = require('../../models/bicicleta');
const Usuario = require('../../models/usuario');
const Reserva = require('../../models/reserva');

describe('Testing Usuarios', function(){
    beforeEach(function(done){
        const mongoDB = 'mongodb://localhost/testdb';
        mongoose.connect(mongoDB, {useNewUrlParser: true});

        const db = mongoose.connection;
        db.on('error', console.error.bind(console, "connection error"));
        db.once('open', function(){
            console.log('Conectado a la base de datos');
            done()
        });
    });

    afterEach(function(done){
        Reserva.deleteMany({}, function(err, success){
            if(err) console.log(err);
            Usuario.deleteMany({}, function(err, success){
                if(err) console.log(err);
                Bicicleta.deleteMany({}, function(err, success){
                    if(err) console.log(err);
                    done();
                });
            });
        });
    });

    describe('Usuario reserva bici', () => {
        it('debe existir la reserva', (done) => {
            const usuario = new Usuario({nombre: 'Ezequiel'});
            usuario.save()
            const bicicleta = new Bicicleta({code: 1, color: "verde", modelo: "urbana"});
            bicicleta.save();

            var hoy = new Date();
            var mañana = new Date();

            //exec ejecuta el callback una vez que la o las promesas terminaron su ejecucion
            //populate trar desde las referecias bicicleta y usuario la instacia completa del modelo, para poder el resto de propiedades
            mañana.setDate(hoy.getDate()+1);
            usuario.reservar(bicicleta.id, hoy, mañana, function(err, reserva){
                Reserva.find({}).populate('bicicleta').populate('usuario').exec(function(err, reservas){
                    console.log(reservas);
                    expect(reservas.length).toBe(1);
                    expect(reservas[0].diasDeReserva(1));
                    expect(reservas[0].diasDeReserva()).toBe(2);
                    expect(reservas[0].bicicleta.code).toBe(1);
                    expect(reservas[0].usuario.nombre).toBe(usuario.nombre);
                    done();

                })
            })
        })
    })
});
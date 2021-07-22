const mongoose = require('mongoose');
const Bicicleta = require('../../models/bicicleta');

describe('Testing Bicicletas', function(){
    beforeEach((done) => {
        const mongoDB = 'mongodb://localhost/testdb'
        mongoose.connect(mongoDB, { useUnifiedTopology: true, useNewUrlParser: true })
        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error'));
        db.once('open', () => {
            console.log('We are connected to test database');
            done();
        });
    });

    afterEach((done) => {
        Bicicleta.deleteMany({}, (err, success) => {
            if(err) console.log(err);
            mongoose.disconnect(err);
            done();
        });
    });

    describe('Bicicleta.createInstance', () => {
        it('Crea una instancia de Bicicleta', () => {
            const bici = Bicicleta.createInstance(1, "verde", "urbana", [-34.5, -54.1]);
            expect(bici.code).toBe(1);
            expect(bici.color).toBe("verde");
            expect(bici.modelo).toBe("urbana");
            expect(bici.ubicacion[0]).toEqual(-34.5);
            expect(bici.ubicacion[1]).toEqual(-54.1);
        })
    })

    describe('Bicicleta.allBicis', () => {
        it('comienza vacía', (done) => {
            Bicicleta.allBicis(function(err, bicis){
                expect(bicis.length).toBe(0);
                done();
            })
        })
    })

    describe('Bicicleta.add', () => {
        it('agrega solo una bici', (done) => {
            const aBici = new Bicicleta({code: 1, color: "verde", modelo: "urbana"});
            Bicicleta.add(aBici, function(err, newBici){
                if (err) console.log(err);
                Bicicleta.allBicis(function(err, bicis){
                    expect(bicis.length).toEqual(1);
                    expect(bicis[0].code).toEqual(aBici.code);
                    done();
                });
            });
        });
    });

    describe('Bicicleta.FindByCode', () => {
        it('debe devolver la bici con code 1', (done) => {
            Bicicleta.allBicis(function(err, bicis){
                expect(bicis.length).toBe(0);

                const aBici = new Bicicleta({code: 1, color: "verde", modelo: "urbana"});
                Bicicleta.add(aBici, function(err, newBici){
                    if (err) console.log(err);

                    const aBici2 = new Bicicleta({code: 1, color: "verde", modelo: "urbana"});
                    Bicicleta.add(aBici2, function(err, newBici){
                        if (err) console.log(err);

                        Bicicleta.findByCode(1, function(err, targetBici){
                            expect(targetBici.code).toBe(aBici.code);
                            expect(targetBici.color).toBe(aBici.color);
                            expect(targetBici.modelo).toBe(aBici.modelo);
                            done();
                        });
                    });
                });
            });
        });
    });
});





/**
 beforeEach(() => { Bicicleta.allBicis = []; }); //Este metodo se ejecuta antes de cada prueba
//beforeEach(() => console.log("testeando")); 
describe('Bicicleta.allBicis',() => {
    it('comienza vacía', () => {
        expect(Bicicleta.allBicis.length).toBe(0);
    });
});

describe('Bicicleta.add', () => {
    it('agregamos una bici', () => {
        var a = new Bicicleta(2, 'blanca', 'urbana', [-33.521752044848284, -70.78430322782194]);
        Bicicleta.add(a);

        expect(Bicicleta.allBicis.length).toBe(1);
        expect(Bicicleta.allBicis[0]).toBe(a);
    });
});

describe('Bicicleta.findById', () => {
    it('debe traer la bici con id 1', () => {
        var aBici = new Bicicleta(1, "verde", "urbana");
        var bBici = new Bicicleta(2, "rojo", "urbana");
        Bicicleta.add(aBici);
        Bicicleta.add(bBici);

        var targetBici = Bicicleta.findById(1);
        expect(targetBici.id).toBe(1);
        expect(targetBici.color).toBe(aBici.color);
        expect(targetBici.modelo).toBe(aBici.modelo);
    });
});

describe('Bicicleta remove', () => {
    it('eliminar una bici', () => {
        var aBici = new Bicicleta(1, "verde", "urbana");
        Bicicleta.add(aBici);
        
        Bicicleta.removeById(aBici.id);
        expect(Bicicleta.allBicis.length).toBe(0);
    });
});

 */

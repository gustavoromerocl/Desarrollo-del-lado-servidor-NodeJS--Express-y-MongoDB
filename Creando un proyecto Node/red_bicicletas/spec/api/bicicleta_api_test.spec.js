/**https://www.npmjs.com/package/node-fetch */
var Bicicleta = require('../../models/bicicleta');
const fetch = require('node-fetch');
const server = require('../../bin/www')

describe('Bicicleta API', () => {
    describe('GET BICICLETAS /', () => {
        it('status 200', () => {
            expect(Bicicleta.allBicis.length).toBe(0);
            var a = new Bicicleta(2, 'blanca', 'urbana', [-33.521752044848284, -70.78430322782194]);
            Bicicleta.add(a);

            fetch('http://localhost:3000/api/bicicletas')
            .then( res => expect(res.status).toBe(200) );
        })
    })

    describe('POST BICICLETAS /create', () => {
        it('STATUS 200', (done) => {
            var headers = {'content-type' : 'application/json'};
            var aBici = '{"id": 10, "color": "rojo", "modelo": "urbana", "latitude": -34, "longitud": -54}';

            const options = {
                method: 'POST',
                body: aBici,
                headers: headers
            }

            fetch('http://localhost:3000/api/bicicletas/create', options)
            .then((res) => {
                expect(res.status).toBe(200);
                expect(Bicicleta.findById(10).color).toBe("rojo");
                done();
            })
        })
    }) 

    describe('POST BICICLETAS /update', () => {
        it('STATUS 200', (done) => {
            var headers = {'content-type' : 'application/json'};
            var aBici = '{"id": 10, "color": "rojo", "modelo": "urbana", "latitude": -34, "longitud": -54}';

            const options = {
                method: 'POST',
                body: aBici,
                headers: headers
            }

            fetch('http://localhost:3000/api/bicicletas/create', options)
            .then((res) => {
                expect(res.status).toBe(200);
            })

            var bBici = '{"id": 10, "color": "verde", "modelo": "urbana", "latitude": -34, "longitud": -54}';

            const optionsUpdate = {
                method: 'POST',
                body: bBici,
                headers: headers
            }

            fetch('http://localhost:3000/api/bicicletas/update', optionsUpdate)
            .then((res) => {
                expect(res.status).toBe(200);
                expect(Bicicleta.findById(10).color).toBe("verde");
                done();
            })
        })
    }) 

    describe('POST BICICLETAS /delete', () => {
        it('STATUS 200', (done) => {
            var headers = {'content-type' : 'application/json'};
            var aBici = '{"id": 10, "color": "rojo", "modelo": "urbana", "latitude": -34, "longitud": -54}';

            const options = {
                method: 'POST',
                body: aBici,
                headers: headers
            }

            var idBici = '{"id": 10}';

            const optionsDelete = {
                method: 'POST',
                body: idBici,
                headers: headers
            }

            fetch('http://localhost:3000/api/bicicletas/create', options)
            .then((res) => {
                expect(res.status).toBe(200);
                expect(Bicicleta.allBicis.length).toBe(1);
            })
            .then(() =>  
                fetch('http://localhost:3000/api/bicicletas/delete', optionsDelete)
                    .then((res) => {
                    expect(res.status).toBe(204);
                    expect(Bicicleta.allBicis.length).toBe(0);
                    done();
                })
            )

        })
    }) 



    
})
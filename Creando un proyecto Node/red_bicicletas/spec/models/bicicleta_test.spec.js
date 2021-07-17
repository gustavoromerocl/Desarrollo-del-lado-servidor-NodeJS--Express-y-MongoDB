var Bicicleta = require('../../models/bicicleta');

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


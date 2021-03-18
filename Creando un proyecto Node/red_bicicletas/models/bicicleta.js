var Bicicleta = function(id, color, modelo, ubicacion){
    this.id = id;
    this.color = color;
    this.modelo = modelo;
    this.ubicacion = ubicacion;
}

Bicicleta.prototype.toString = function(){
    return 'id ' + this.id + ' | color: ' + this.color; 
}

Bicicleta.allBicis = [];

Bicicleta.add = function(aBici){
    Bicicleta.allBicis.push(aBici)
};

Bicicleta.findById = function(aBiciId){
    var aBici = Bicicleta.allBicis.find(x => x.id == aBiciId);
    if(aBici)
        return aBici;
    else
        throw new Error(`No existe un bici con el id que indicas ${aBiciId}`)
}

Bicicleta.removeById = function(aBiciId){
    console.log(aBiciId);
    let aBici = Bicicleta.findById(aBiciId);
    if(aBici) {
        const newAllbicis =  Bicicleta.allBicis.filter(x => x.id != aBiciId);
        Bicicleta.allBicis = newAllbicis;
    }
    else
        throw new Error(`No existe una bici con el id ${aBiciId}`)
}

var a = new Bicicleta(1, 'rojo', 'urbana', [-33.521743100472484, -70.78299430982995]);
var b = new Bicicleta(2, 'blanca', 'urbana', [-33.521752044848284, -70.78430322782194]);

Bicicleta.add(a);
Bicicleta.add(b);

module.exports = Bicicleta;
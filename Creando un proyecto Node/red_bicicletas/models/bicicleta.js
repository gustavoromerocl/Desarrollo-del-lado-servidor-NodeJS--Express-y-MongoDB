var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bicicletaSchema = new Schema({
    code: Number,
    color: String,
    modelo: String,
    ubicacion: {
        type: [Number], index: {type: '2dsphere', sparse: true}
    }
})

bicicletaSchema.statics.createInstance = function ( code, color, modelo, ubicacion ) {
    return new this({
        code: code,
        color: color,
        modelo: modelo,
        ubicacion: ubicacion
    });
};

bicicletaSchema.methods.toString = function() {
    return `code: ${this.code} color: ${this.color}`
}

bicicletaSchema.statics.allBicis = function(cb){
    return this.find({}, cb)
}

bicicletaSchema.statics.add = function(aBici, cb){
    return this.create(aBici, cb)
}

bicicletaSchema.statics.findByID = function(id, cb){
    return this.findOne({id: id}, cb)
}

bicicletaSchema.statics.findByCode = function(code, cb){
    return this.findOne({code: code}, cb)
}


bicicletaSchema.statics.removeById = function(id, cb){
    return this.deleteOne({id: id}, cb)
}


module.exports =  mongoose.model("Bicicleta", bicicletaSchema);

/*
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


//var a = new Bicicleta(1, 'rojo', 'urbana', [-33.521743100472484, -70.78299430982995]);
//var b = new Bicicleta(2, 'blanca', 'urbana', [-33.521752044848284, -70.78430322782194]);

//Bicicleta.add(a);
//Bicicleta.add(b);

module.exports = Bicicleta;
*/
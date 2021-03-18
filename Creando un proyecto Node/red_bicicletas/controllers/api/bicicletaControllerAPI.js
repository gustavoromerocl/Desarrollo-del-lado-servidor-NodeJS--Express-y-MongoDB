const Bicicleta = require('../../models/bicicleta')
var bicicleta = require('../../models/bicicleta')

exports.bicicleta_list = function(req, res){
    res.status(200).json({
        bicicletas: Bicicleta.allBicis
    })
}

exports.bicicleta_create = function(req, res){
    let bici = new Bicicleta(req.body.id, req.body.color, req.body.modelo);
    bici.ubicacion = [req.body.latitude, req.body.longitud];
    Bicicleta.add(bici);

    res.status(200).json({
        bicicleta: bici
    });
}

exports.bicicleta_delete = function(req, res){
    Bicicleta.removeById(req.body.id);

    res.status(204).send();
}

exports.bicicleta_update = function(req, res){
    var bici = Bicicleta.findById(req.body.id)
    bici.id = req.body.id;
    bici.color = req.body.color;
    bici.modelo = req.body.modelo;
    bici.ubicacion = [req.body.latitude, req.body.longitud];
    res.status(200).json({
        bicicleta: bici
    })
}

exports.bicicleta_update_post = function(req, res){


    res.redirect('/bicicletas');
}
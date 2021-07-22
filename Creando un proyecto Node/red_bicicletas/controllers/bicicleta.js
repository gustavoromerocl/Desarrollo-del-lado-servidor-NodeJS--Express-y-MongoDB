const Bicicleta = require('../models/bicicleta');

exports.bicicleta_list = function(req, res){
    res.render('bicicletas/index', {bicis: Bicicleta.allBicis});
}

exports.bicicleta_create_get = function(req, res){
    res.render('bicicletas/create')
}

exports.bicicleta_create_post = function(req, res){
    var bici = new Bicicleta(req.body.code, req.body.color, req.body.modelo);
    bici.ubicacion = [req.body.latitude, req.body.longitud];
    Bicicleta.add(bici);

    res.redirect('/bicicletas');
}

exports.bicicleta_update_get = function(req, res){
    var bici = Bicicleta.findById(req.params.code)
    res.render('bicicletas/update', {bici})
}

exports.bicicleta_update_post = function(req, res){
    var bici = Bicicleta.findById(req.params.code)
    bici.code = req.body.code;
    bici.color = req.body.color;
    bici.modelo = req.body.modelo;
    bici.ubicacion = [req.body.latitude, req.body.longitud];

    res.redirect('/bicicletas');
}

exports.bicicleta_delete_post = function(req, res){
    Bicicleta.removeById(req.body.code);

    res.redirect('/bicicletas');
}
const Bicicleta = require('../../models/bicicleta')

exports.bicicleta_list = function(req, res){
    Bicicleta.allBicis().exec((err, bicis) => {
        res.status(200).json({
            bicicletas: bicis
        })
    })

}

exports.bicicleta_create = function(req, res){
    const bici = new Bicicleta(
        {
            code: req.body.code,
            color: req.body.color,
            modelo: req.body.modelo,
            //ubicacion: [req.body.lat || 0, req.body.lng || 0]
        }
    );
    //bici.ubicacion = [req.body.latitude, req.body.longitud];
    
    Bicicleta.add(bici);

    res.status(200).json({
        bicicleta: bici
    });
}

exports.bicicleta_delete = function(req, res){
    Bicicleta.removeById(req.body.code);

    res.status(204).send();
}

exports.bicicleta_update = function(req, res){
    var bici = Bicicleta.findById(req.body.code)
    bici.code = req.body.code;
    bici.color = req.body.color;
    bici.modelo = req.body.modelo;
    bici.ubicacion = [req.body.latitude, req.body.longitud];
    res.status(200).json({
        bicicleta: bici
    })
}


const Bicicleta = require('../../models/bicicleta')

exports.bicicleta_list = function(req, res){
    res.status(200).json({
        bicicletas: Bicicleta.allBicis
    })
}

exports.bicicleta_create = function(req, res){
    const ubicacion = [req.body.latitude, req.body.longitud];
    let bici = Bicicleta.createInstance(req.body.code, req.body.color, req.body.modelo, ubicacion);
    

    Bicicleta.add(bici, function(err, newBici){
        if (err) console.log(err);
    });

    res.status(200).json({
        bicicleta: bici
    });
/**
 
 */
}

exports.bicicleta_delete = function(req, res){
    var bici = Bicicleta.findOne({code: req.body.code})

    bici.exec(function(err, bici){
        console.log(bici.code);
        bici.deleteOne({code: bici.code});

        res.status(204).send();
    })

}
    


exports.bicicleta_update = function(req, res){
    var bici = Bicicleta.findOne({code: req.body.code})
    
    bici.exec(function(err, bici){
        //console.log(bici);
        bici.code = req.body.code;
        bici.color = req.body.color;
        bici.modelo = req.body.modelo;
        bici.ubicacion = [req.body.latitude, req.body.longitud];
        bici.save();
        res.status(200).json({
            bicicleta: bici
        })
    })
}


const Bicicleta = require('../models/bicicleta');

exports.bicicleta_list = function(req, res){
    Bicicleta.allBicis().exec((err, bicis) => {
        res.render('bicicletas/index', {bicis});
    })
}

exports.bicicleta_create_get = function(req, res){
    res.render('bicicletas/create')
}

exports.bicicleta_create_post = function(req, res){
    const bici= new Bicicleta(
        {
            code: req.body.code,
            color: req.body.color,
            modelo: req.body.modelo,
            ubicacion: [req.body.latitude, req.body.longitud]
        }
    );
    //console.log("bici a añadir",bici);
    Bicicleta.add(bici);

    res.redirect('/bicicletas');
}

exports.bicicleta_update_get = function(req, res){
    //console.log("req.params", req.params)
    //Metodo find: retorna un array con los objetos que coincidan con los criterios de busqueda
    //Metodo findOne: Retorna el objeto que coincida con el criterio de busqueda
    //var query = Bicicleta.find({_id: req.params.id});

    var query = Bicicleta.findOne({_id: req.params.id});
    query.exec(function(err, bici){
    if (err) console.log(err) ;
    res.render('bicicletas/update', {bici});
    });
}

exports.bicicleta_update_post = function(req, res){
    const ubicacion = [req.body.latitude, req.body.longitud]
    console.log(req.body)

    Bicicleta.findOneAndUpdate(
        {_id: req.params.id},
        {
            $set:{color: req.body.color, modelo: req.body.modelo}
        },
        {new:true, setDefaultsOnInsert: true},
        function(err, doc){
        if (err) console.log(err) ;
        //console.log(doc.ubicacion);
    });


/*
    Bicicleta.findOneAndUpdate(
        {_id: req.params.id},
        {$set: { "ubicacion.$.0": req.body.latitude, "ubicacion.$.1": req.body.longitud}},
        {new:true},
        function(err, doc){
        if (err) console.log(err) ;
        console.log(doc);
    });
*/
    res.redirect('/bicicletas');
}

exports.bicicleta_delete_post = function(req, res){
    Bicicleta.findByIdAndDelete(req.body.id, (err) => {
        if (err) {
          next(err);
        } else {
          res.redirect('/bicicletas');
        }
    });
     
}
var Usuario = require('../models/usuario');

module.exports = {
  //  Lista todos los usuarios
    list: function (req, res, next) {
        Usuario.find({}, (err, usuarios) => {
        let data = {
            usuarios: []
        }
        if (usuarios.length > 0) {
            data.usuarios = usuarios
        }
        console.log(data)
        res.render('usuarios/index', data)
        })
    },

    //Trae a el usuario por el id y lo envia al render
    update_get: function (req, res, next) {
        Usuario.findById(req.params.id, (err, usuario) => {
        //Se envia el parametro errors ya que la vista lo requiere
        res.render('usuarios/update', {
            errors: {},
            usuario: usuario
        })
        })
    },

    //Actualiza el usuario traido en el metodo anterior
    /*findByIdAndUpdate (operation mongo)
        Funcion de mongo db para actualizar los aprametro mediante el id
    */
    update: function (req, res, next) {
        var update_values = { nombre: req.body.nombre};
        Usuario.findByIdAndUpdate(req.params.id, update_values, (err, usuario) => {
        if (err) {
            console.log(err);
            res.render('usuarios/update', {
            errors: err.errors,
            usuario
            })
        } else {
            res.redirect('/usuarios');
            return;
        }
        })
    },

    //Direcciona a la vista create
    create_get: function (req, res, next) {
        res.render('usuarios/create', {
        errors: {},
        usuario: new Usuario()
        });
    },

    //Crea el nuevo usuario
    create: function (req, res, next) {
        //valida que el password este correcto y coincida 
        if (req.body.password != req.body.confirm_password) {
        //Se renderiza con el error en caso de haber
        res.render('usuarios/create', {
            errors: {
            confirm_password: {
                message: 'No conciden las contraseñas'
            }
            },
            usuario: new Usuario({
            nombre: req.body.nombre,
            email: req.body.email
            })
        })
        return
        }

        //Si no hay errores crea el usuario
        Usuario.create({
        nombre: req.body.nombre,
        email: req.body.email,
        password: req.body.password
        }, (err, nuevoUsuario) => {
        if (err) {
            res.render('usuarios/create', {
            errors: err.errors,
            usuario: new Usuario()
            })
        } else {
            //Se envia mail de bienvenida 
            nuevoUsuario.enviar_email_bienvenida(); //CREATE A ERROR
            res.redirect('/usuarios');
        }
        })
    },

    //Elimina un usuaario por id
    delete: function (req, res, next) {
        Usuario.findByIdAndDelete(req.body.id, (err) => {
        if (err) {
            next(err);
        } else {
            res.redirect('/usuarios')
        }
        })
    }
}
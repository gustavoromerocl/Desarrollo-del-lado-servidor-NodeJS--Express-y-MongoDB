module.exports = {
    index: function(req, res){
        res.render('session/index', {title: "LOGIN"})
    },

    forgot_password: function(req, res){
        res.render('session/forgotPassword', {title: "FORGOT PASSWORD"})
    }
}
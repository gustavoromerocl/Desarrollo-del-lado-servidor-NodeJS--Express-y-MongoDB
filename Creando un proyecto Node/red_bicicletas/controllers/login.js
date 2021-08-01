module.exports = {
    index: function(req, res){
        res.render('login/index', {title: "LOGIN"})
    },

    forgot_password: function(req, res){
        res.render('login/forgotPassword', {title: "FORGOT PASSWORD"})
    }
}
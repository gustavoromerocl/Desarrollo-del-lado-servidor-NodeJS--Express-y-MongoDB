var express = require('express');
var router = express.Router();
const loginController = require('../controllers/login')

/* GET home page. */
router.get('/', loginController.index);
router.get('/forgotPassword', loginController.forgot_password);

module.exports = router;

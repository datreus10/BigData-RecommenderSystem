var express = require('express');
var router = express.Router();
const {getHomePage} = require('../controllers/home');
const {verifytoken} = require('../middleware/auth')
/* GET home page. */
router.get('/',verifytoken, getHomePage);

module.exports = router;

var express = require('express');
var router = express.Router();
var {getmoviespage,search} = require('../controllers/movies');
/* GET home page. */
router.get('/', getmoviespage);
router.post('/', search);


module.exports = router;

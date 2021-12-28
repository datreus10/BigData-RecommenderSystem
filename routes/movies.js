var express = require('express');
var router = express.Router();
var {getmoviespage,search,detailMovie} = require('../controllers/movies');
/* GET home page. */
router.get('/', getmoviespage);
router.get('/detail',detailMovie);
router.post('/', search);


module.exports = router;

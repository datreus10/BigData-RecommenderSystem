var express = require('express');
var router = express.Router();
var {getmoviespage,search,filter,detailMovie} = require('../controllers/movies');
/* GET home page. */
router.get('/', getmoviespage);
router.get('/detail',detailMovie);
router.post('/search', search);
router.post('/filter', filter);

module.exports = router;

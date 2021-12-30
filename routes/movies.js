var express = require('express');
var router = express.Router();
var {
    getmoviespage,
    search,
    filter,
    detailMovie,
    reviewMovie
} = require('../controllers/movies');
/* GET home page. */
router.get('/', getmoviespage);
router.get('/detail', detailMovie);
router.post('/review', reviewMovie);
router.post('/search', search);
router.post('/filter', filter);

module.exports = router;
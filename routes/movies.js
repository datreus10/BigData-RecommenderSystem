var express = require('express');
var router = express.Router();
var {
    getmoviespage,
    search,
    detailMovie,
    reviewMovie,
    getrating,
    postrating,
} = require('../controllers/movies');
const {verifytoken} = require('../middleware/auth')

/* GET home page. */
router.get('/',verifytoken, getmoviespage);
router.get('/rating',verifytoken, getrating);
router.post('/rating',verifytoken, postrating);
router.get('/detail',verifytoken, detailMovie);
router.post('/review',verifytoken, reviewMovie);
router.post('/',verifytoken, search);


module.exports = router;
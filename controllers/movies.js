const getmoviespage = (req, res, next) => {
    res.render('movies');
}
const search = (req, res, next) => {
    res.send(req.body);
}
module.exports = {
    getmoviespage,search
}
const getmoviespage = (req, res, next) => {
  res.render("movies");
};

const detailMovie = (req, res, next) => {
  res.render("detail");
};

const search = (req, res, next) => {
  res.send(req.body);
};
module.exports = {
  getmoviespage,
  search,
  detailMovie,
};

const movieAPI = require("../helper/movieAPI");

const newMovies = [862, 8844, 15602, 31357, 11862];

const getHomePage = async (req, res, next) => {
  res.render("index", {
    movies: await movieAPI.getMoviesById(newMovies),
    user: req.user,
  });
};

module.exports = {
  getHomePage,
};

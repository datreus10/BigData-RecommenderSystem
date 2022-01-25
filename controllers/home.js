const movieAPI = require("../helper/movieAPI");
const helper = require("../helper/helper");
const recAPI = require("../helper/recApi");

const getHomePage = async (req, res, next) => {
  const newMovies = await recAPI.getRandomMovies(6);
  res.render("index", {
    ids: newMovies,
    movies: await movieAPI.getMoviesById(newMovies["tmdbId"]),
    user: req.user,
  });
};

module.exports = {
  getHomePage,
};
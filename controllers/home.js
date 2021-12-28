const movieAPI = require("../helper/movieAPI");

const testMovies = [
  "Toy Story (1995)",
  "Jumanji (1995)",
  "Grumpier Old Men (1995)",
  "Waiting to Exhale (1995)",
  "Father of the Bride Part II (1995)",
];

const getHomePage = async (req, res, next) => {
  // const moviesFetch = Promise.all(
  //   testMovies.map((item) => {
  //     const movie = movieAPI.splitMovieNameAndYear(item);
  //     return movieAPI.searchByNameAndYear(movie.name, movie.year);
  //   })
  // ).then((values) => values.map((e) => e.results[0]));

  // const movies = moviesFetch;

  res.render("index", {
    movies: testMovies
  });
};

module.exports = {
  getHomePage,
};

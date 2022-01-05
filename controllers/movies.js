const movieAPI = require("../helper/movieAPI");
const recAPI = require("../helper/recAPI");
var Movie = require("../models/movie");

const getmoviespage = async (req, res, next) => {
  const user = req.user;
  let userId = user.id;
  let recMovies = [];
  if (userId != null) {
    let recommendmovie = await Movie.find({ userId });
    if (recommendmovie !== null && recommendmovie.length > 0) {
      recMovies = recommendmovie.map((movie) => movie.tmdbId);
      const fetchMovies = await movieAPI.getMoviesById(recMovies);
      res.render("movies", {
        movies: fetchMovies,
        recommendmovies: fetchMovies.slice(0, 5),
        user: req.user,
      });
    } else {
      res.redirect("movies/rating");
    }
  } else {
    for (let i = 0; i < 100; i++) {
      recMovies.push(Math.floor(Math.random() * 1000));
    }
    let fetchMovies = await movieAPI.getMoviesById(recMovies);
    let sorted = fetchMovies.sort((a, b) => b.vote_average - a.vote_average);
    res.render("movies", {
      movies: sorted,
      recommendmovies: sorted.slice(0, 5),
      user: req.user,
    });
  }
};

const detailMovie = (req, res, next) => {
  res.render("detail", {
    user: req.user,
    recMovies: [1, 2, 3, 4, 5],
  });
};

const parseReview = (data) => {
  const rating = parseFloat(data.rating.replace(" and a half", ".5"));
  const isValid = Object.values(data).every((value) => {
    if (value) {
      return true;
    }
    return false;
  });
  if (!isValid || !rating) throw "Data review not valid";
  return {
    title: data.title,
    review: data.review,
    rating: rating,
  };
};

const reviewMovie = (req, res, next) => {
  try {
    const review = parseReview(req.body);
    console.log(review);
    res.render("detail", {
      user: req.user,
    });
  } catch (error) {
    console.log(error);
    next(createError(404));
  }
};

const search = async (req, res, next) => {
  let listmovie = await movieAPI.searchByName(req.body.keywords);
  res.render("movies", {
    movies: listmovie.results,
    recommendmovies: [],
    user: req.user,
  });
};
const getsearch = async (req, res, next) => {
  let recMovies = [];
  for (let i = 0; i < 100; i++) {
    recMovies.push(Math.floor(Math.random() * 1000));
  }
  let fetchMovies = await movieAPI.getMoviesById(recMovies);
  res.render("movies", {
    movies: fetchMovies,
    recommendmovies: [],
    user: req.user,
  });
};

const filter = (req, res, next) => {
  res.send(req.body);
};

const getrating = async (req, res, next) => {
  let listmovie = [];
  for (let i = 0; i < 10; i++) {
    listmovie.push(Math.floor(Math.random() * 1000));
  }
  res.render("rating", {
    movies: await movieAPI.getMoviesById(listmovie),
    user: req.user,
  });
};
const postrating = async (req, res, next) => {
  const postData = [];
  for (const property in req.body) {
    const tmp = req.body[property].split(" ");
    postData.push({
      userId: req.user.id,
      movieId: tmp[0],
      rating: tmp[1],
    });
  }
  const result = await recAPI.postRating(postData);
  if (result) {
    res.send(result);
  } else {
    next(createError(404));
  }
};

module.exports = {
  getmoviespage,
  search,
  filter,
  detailMovie,
  reviewMovie,
  getrating,
  postrating,
  getsearch,
};

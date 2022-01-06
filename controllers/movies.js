const movieAPI = require("../helper/movieAPI");
const recAPI = require("../helper/recAPI");
var Movie = require("../models/movie");
const { type } = require("express/lib/response");

const getmoviespage = async (req, res, next) => {
  const userId = req.user.id;
  if (userId) {
    const cacheMovies = await Movie.findOne({
      userId: userId,
    });
    if (cacheMovies) {
      const fetchMovies = await movieAPI.getMoviesById(
        cacheMovies.recMovies.map((e) => e.tmdbId)
      );
      res.render("movies", {
        movies: fetchMovies,
        recommendmovies: fetchMovies.slice(0, 5),
        user: req.user,
      });
    } else {
      res.redirect("movies/rating");
    }
  } else {
    const listId = (await recAPI.getRandomMovies(50))["tmdbId"];
    let fetchMovies = await movieAPI.getMoviesById(listId);
    let sorted = fetchMovies.sort((a, b) => b.vote_average - a.vote_average);
    res.render("movies", {
      movies: sorted,
      recommendmovies: sorted.slice(0, 5),
      user: req.user,
    });
  }

  // const user = req.user;
  // let userId = user.id;
  // let recMovies = [];
  // if (userId != null) {
  //   let recommendmovie = await Movie.find({ userId });
  //   if (recommendmovie !== null && recommendmovie.length > 0) {
  //     recMovies = recommendmovie.map((movie) => movie.tmdbId);
  //     const fetchMovies = await movieAPI.getMoviesById(recMovies);
  //     res.render("movies", {
  //       movies: fetchMovies,
  //       recommendmovies: fetchMovies.slice(0, 5),
  //       user: req.user,
  //     });
  //   } else {
  //     res.redirect("movies/rating");
  //   }
  // } else {
  //   for (let i = 0; i < 100; i++) {
  //     recMovies.push(Math.floor(Math.random() * 1000));
  //   }
  //   let fetchMovies = await movieAPI.getMoviesById(recMovies);
  //   let sorted = fetchMovies.sort((a, b) => b.vote_average - a.vote_average);
  //   res.render("movies", {
  //     movies: sorted,
  //     recommendmovies: sorted.slice(0, 5),
  //     user: req.user,
  //   });
  // }
};

const detailMovie = async (req, res, next) => {
  const cacheMovies = await Movie.findOne({
    userId: req.user.id,
  });

  let listId;
  if (cacheMovies)
    listId = cacheMovies.recMovies.slice(0, 5).map((e) => e.tmdbId);
  else listId = (await recAPI.getRandomMovies(5))["tmdbId"];

  const recMovies = await movieAPI.getMoviesById(listId);
  const movieDetail = await movieAPI.getMoviesById([req.query.tmdbId]);
  res.render("detail", {
    user: req.user,
    movie: movieDetail[0],
    recMovies: recMovies,
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
  let listgen = await movieAPI.getGenres();
  let listmovie = [];
  if (req.body.keywords != null) {
    listmovie = await movieAPI.searchByName(req.body.keywords);
    listmovie.results.forEach((movie) => {
      movie.genres = movie.genre_ids.map((genre) => {
        return listgen.genres.filter((a) => a.id == genre)[0];
      });
    });
    res.render("movies", {
      movies: listmovie.results,
      recommendmovies: [],
      user: req.user,
    });
  } else {
    let listid = [];
    for (let i = 0; i < 1000; i++) {
      listid.push(i);
    }
    listmovie = await movieAPI.getMoviesById(listid);
    let { type, starbegin, starend, yearbegin, yearend } = req.body;
    listmovie = listmovie.filter((movie) => {
      let year = movie.release_date.split("-")[0];
      let gen = movie.genres.filter((a) => a.name == type);
      let star = movie.vote_average / 2;
      return (
        gen.length != 0 &&
        star > starbegin &&
        star < starend &&
        year > yearbegin &&
        year < yearend
      );
    });
    res.render("movies", {
      movies: listmovie,
      recommendmovies: [],
      user: req.user,
    });
  }
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
  const userId = req.user.id;
  for (const property in req.body) {
    const tmp = req.body[property].split(" ");
    postData.push({
      userId: userId,
      movieId: tmp[0],
      rating: tmp[1],
    });
  }
  const postRes = await recAPI.postRating(postData);
  console.log(postRes);
  if (postRes) {
    const recMovies = await recAPI.recMovieForUser(userId);
    const movie = {
      userId: userId,
      recMovies: recMovies["movieId"].map((e, i) => {
        return {
          movieId: e,
          tmdbId: recMovies["tmdbId"][i],
        };
      }),
    };
    const filter = { userId: userId };
    await Movie.findOneAndUpdate(filter, movie, { upsert: true });
    res.redirect("/movies");
  } else {
    next(createError(404));
  }
};

module.exports = {
  getmoviespage,
  search,
  detailMovie,
  reviewMovie,
  getrating,
  postrating,
};

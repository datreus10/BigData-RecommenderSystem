const movieAPI = require("../helper/movieAPI");
const { spawn } = require("child_process");

const categorytemp = ['Action/Adventure', 'Kids & Family', 'Medical', 'Military/War', 'Music,Musical', 'Mystery/Crime', 'Nature', 'Paranormal', 'Politics', 'Racing', 'Romance', 'Science', 'ScienceFiction', 'Science/Nature', 'Spanish', 'Travel', 'Western']

const getmoviespage = (req, res, next) => {
  const userId = 99;
  let recommendation;
  let listmovies;
  let recommendmovies;

  const python = spawn("python3", ["./recommendation/test.py", userId]);
  python.stdout.on("data", function (data) {
    recommendation += data.toString();
  });
  
  python.on("close", async (code) => {
    recommendation=recommendation.substring(recommendation.indexOf('{'), recommendation.indexOf('}')+1)
    recommendation = JSON.parse(recommendation);
    res.render("movies", {
      category: categorytemp,
      movies: await movieAPI.getMoviesById(recommendation["tmdbId"]),
      recommendmovies: await movieAPI.getMoviesById(recommendation["tmdbId"].splice(0,5)),
      user: req.user
    });
  });
};

const detailMovie = (req, res, next) => {
  res.render("detail", {
    user: req.user,
    recMovies: [1, 2, 3, 4, 5]
  });
};



const parseReview = (data) => {
  const rating = parseFloat(data.rating.replace(' and a half', '.5'));
  const isValid = Object.values(data).every(value => {
    if (value) {
      return true;
    }
    return false;
  });
  if (!isValid || !rating)
    throw 'Data review not valid';
  return {
    title: data.title,
    review: data.review,
    rating: rating
  }

}

const reviewMovie = (req, res, next) => {
  try {
    const review = parseReview(req.body);
    console.log(review);
    res.render("detail", {
      user: req.user
    });
  } catch (error) {
    console.log(error);
    next(createError(404));
  }

};

const search = (req, res, next) => {
  res.send(req.body);
};

const filter = (req, res, next) => {
  res.send(req.body);
};

module.exports = {
  getmoviespage,
  search,
  filter,
  detailMovie,
  reviewMovie
};
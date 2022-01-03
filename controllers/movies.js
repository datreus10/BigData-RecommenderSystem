const movieAPI = require("../helper/movieAPI");
const { spawn } = require("child_process");
var Movie = require("../models/movie");


const getmoviespage = async (req, res, next) => {
  const user = req.user;
  let userId = user.id;
  let recMovies=[];
  if(userId!='') {
    let recommendmovie = await Movie.find({ userId })
    if (recommendmovie !== null && recommendmovie.length > 0) {
      recMovies = recommendmovie.map(movie => movie.tmdbId);
      const fetchMovies = await movieAPI.getMoviesById(recMovies);
      res.render("movies", {
        movies: fetchMovies,
        recommendmovies: fetchMovies.slice(0, 5),
        user: req.user,
      });
    }
    else {
      res.redirect('movies/rating');
    }
  }
  else
  {
    for(let i=0;i<100;i++)
    {
      recMovies.push((Math.floor(Math.random() * 1000)))
    }
    let fetchMovies = await movieAPI.getMoviesById(recMovies);
    let sorted=fetchMovies.sort((a,b) => b.vote_average-a.vote_average);
    res.render("movies", {
      movies: sorted,
      recommendmovies: sorted.slice(0, 5),
      user: req.user
    });
  }

  // let strData = "";
  // const python = spawn("python", ["./recommendation/recEngine.py", userId]);
  // python.stdout.on("data", function (data) {
  //   strData += data.toString();
  // });

  // python.on("close", async (code) => {
  //   try {
  //     const idx1 = strData.indexOf("{");
  //     const idx2 = strData.indexOf("}");
  //     if (idx1 > -1 && idx2 > -1) {
  //       strData = strData.substring(idx1, idx2 + 1);
  //       recMovies = JSON.parse(strData);
  //     }
  //     else {
  //       recMovies = {"tmdbId": []}
  //     }
  //     const fetchMovies = await movieAPI.getMoviesById(recMovies["tmdbId"]);

  //     res.render("movies", {
  //       category: categorytemp,
  //       movies: fetchMovies,
  //       recommendmovies: fetchMovies.slice(0, 5),
  //       user: req.user,
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     next(createError(404));
  //   }
  // });

  // recommendation=recommendation.substring(recommendation.indexOf('{'), recommendation.indexOf('}')+1)
  // recommendation = JSON.parse(recommendation);
  // res.render("movies", {
  //   category: categorytemp,
  //   movies: await movieAPI.getMoviesById(recommendation["tmdbId"]),
  //   recommendmovies: await movieAPI.getMoviesById(recommendation["tmdbId"].splice(0,5)),
  //   user: req.user
  // });

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

const search = (req, res, next) => {
  res.send(req.body);
};

const filter = (req, res, next) => {
  res.send(req.body);
};

const getrating = async (req, res, next) => { 
  let listmovie = [];
  for (let i = 0; i < 10; i++) {
    listmovie.push(Math.floor(Math.random() * 1000));
  }
  res.render('rating',
    {
      movies: await movieAPI.getMoviesById(listmovie),
      user: req.user,
    })

}
const postrating = async (req, res, next) => {
  let userId = req.user.id;
  console.log(userId);
  listmovie = [];
  listrating = [];
  let strData = "";
  let recMovies;
  let rating = req.body;
  for (let i = 0; i < 6; i++) {
    let arr = rating['like' + i]
    arr = arr.split(' ');
    listmovie.push(arr[0]);
    listrating.push(arr[1]);
  }
  const python = spawn("python", ["./recommendation/recEngine.py", userId, listmovie, listrating]);
  python.stdout.on("data", function (data) {
    strData += data.toString();
  });
  python.on("close", async (code) => {
    try {
      console.log(strData);
      const idx1 = strData.indexOf("{");
      const idx2 = strData.indexOf("}");
      if (idx1 > -1 && idx2 > -1) {
        strData = strData.substring(idx1, idx2 + 1);
        recMovies = JSON.parse(strData);
      }
      if (recMovies["tmdbId"].length > 0) {
        for (let i = 0; i < recMovies["tmdbId"].length; i++) {
          let movie = new Movie({
            userId: userId,
            tmdbId: recMovies["tmdbId"][i],
            movieId: recMovies["movieId"][i]
          })
          console.log(movie);
          await movie.save();
        }
      }
      res.redirect('/movies')
    } catch (error) {
      console.log(error);
      next(createError(404));
    }
  });
};

module.exports = {
  getmoviespage,
  search,
  filter,
  detailMovie,
  reviewMovie,
  getrating,
  postrating,
};

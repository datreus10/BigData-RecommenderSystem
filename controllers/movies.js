const categorytemp = ['Action/Adventure', 'Kids & Family', 'Medical', 'Military/War', 'Music,Musical', 'Mystery/Crime', 'Nature', 'Paranormal', 'Politics', 'Racing', 'Romance', 'Science', 'ScienceFiction', 'Science/Nature', 'Spanish', 'Travel', 'Western']

const listmovie = [{
  name: 'Fast and furious 7',
  star: '10'
}, {
  name: 'John Wick 3',
  star: '10'
}, {
  name: 'John Cenna',
  star: '10'
}, {
  name: 'Fast and furious 7',
  star: '10'
}, {
  name: 'John Wick 3',
  star: '10'
}, {
  name: 'John Cenna',
  star: '10'
}, {
  name: 'Fast and furious 7',
  star: '10'
}, {
  name: 'John Wick 3',
  star: '10'
}, {
  name: 'John Cenna',
  star: '10'
}]

const getmoviespage = (req, res, next) => {
  res.render("movies", {
    category: categorytemp,
    movies: listmovie,
    user: req.user
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
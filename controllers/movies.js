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
    movies: listmovie
  });
};

const detailMovie = (req, res, next) => {
  res.render("detail", {
    user: req.user
  });
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
};
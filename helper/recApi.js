const axios = require("axios").default;

const baseURL = "http://localhost:8000";

const postRating = (listRating) => {
  return axios
    .post(baseURL + `/movie/rating`, listRating)
    .then((res) => res.data)
    .catch((err) => {
      console.log(err);
      return "error";
    });
};

const recMovieForUser = (userId, limit = 50) => {
  return axios
    .get(baseURL + `/movie/rec?userId=${userId}&limit=${limit}`)
    .then((res) => res.data)
    .catch((err) => {
      console.log(err);
      return "error";
    });
};

const convertToTmdbId = (listMovieId) => {
  return axios
    .post(baseURL + `/to_tmdbID`, listMovieId)
    .then((res) => res.data)
    .catch((err) => {
      console.log(err);
      return "error";
    });
};

const convertToMovieId = (listTmdbId) => {
  return axios
    .post(baseURL + `/to_movieID`, listTmdbId)
    .then((res) => res.data)
    .catch((err) => {
      console.log(err);
      return "error";
    });
};

const getRandomMovies = (limit) => {
  return axios
    .get(baseURL + `/movie/random?limit=${limit}`)
    .then((res) => res.data)
    .catch((err) => {
      console.log(err);
      return "error";
    });
};

module.exports = {
  postRating,
  recMovieForUser,
  convertToTmdbId,
  getRandomMovies,
  convertToMovieId,
};

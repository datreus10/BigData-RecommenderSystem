const axios = require("axios").default;
require("dotenv").config();

const baseURL = "https://api.themoviedb.org/3/";
const API_KEY = process.env.TMDB_KEY;

const splitMovieNameAndYear = (txtName) => {
  const result = txtName.split(/[()]/g);
  return {
    name: result[0].trim(),
    year: result[1].trim(),
  };
};

const searchByNameAndYear = async (movieName, year) => {
  try {
    const response = await axios.get(
      baseURL +
        `search/movie?query=${movieName}&year=${year}&api_key=` +
        API_KEY
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const getMoviesById = async(lstId) => {
  try {
    const result = [];
    for (let i = 0; i < lstId.length; i++) {
      const id = lstId[i];
      const response = await axios.get(
        baseURL + `/movie/${id}?api_key=` + API_KEY
      );
      result.push(response.data);
    }
    return result;
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  getMoviesById,
  searchByNameAndYear,
  splitMovieNameAndYear,
};

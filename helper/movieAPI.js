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

module.exports = {
  searchByNameAndYear,
  splitMovieNameAndYear,
};

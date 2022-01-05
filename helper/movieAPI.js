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

const searchByName = async (movieName) => {
  try {
    const response = await axios.get(
      baseURL +
        `search/movie?query=${movieName}&api_key=` +
        API_KEY
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const getMoviesById = (listId) => {
  return Promise.all(
    listId.map((id) =>
      axios
        .get(baseURL + `/movie/${id}?api_key=` + API_KEY)
        .then((response) => {
          return response.status == 200 ? response.data : false;
        })
        .catch((error) => {
          //console.log(error);
          return false;
        })
    )
  ).then((data) => data.filter((e) => e));
};

const getGenres = async () => {
  try {
    const response = await axios.get(
      "https://api.themoviedb.org/3/genre/movie/list?api_key=7e45a30bcb576d87b9f1c53ca284faf0"
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  getMoviesById,
  searchByName,
  splitMovieNameAndYear,
  getGenres,
};

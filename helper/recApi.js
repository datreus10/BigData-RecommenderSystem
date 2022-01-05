const axios = require("axios").default;

const baseURL = "http://localhost:8000";

const postRating = (listRating) => {
  return axios
    .post(baseURL + `/movie/rating`, listRating)
    .then((res) => res.data)
    .catch((err) => console.log(err));
};

module.exports = { postRating };

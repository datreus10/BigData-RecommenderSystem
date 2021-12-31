const movieAPI = require("../helper/movieAPI");
const { spawn } = require("child_process");

const testMovies = [
  "Toy Story (1995)",
  "Jumanji (1995)",
  "Grumpier Old Men (1995)",
  "Waiting to Exhale (1995)",
  "Father of the Bride Part II (1995)",
];

const getHomePage = (req, res, next) => {
  const userId = req.query.userId;

  let result;

  const python = spawn("python3", ["./recommendation/loadRec.py", userId]);
  // collect data from script
  python.stdout.on("data", function (data) {
    result = data.toString();
  });
  // in close event we are sure that stream from child process is closed
  python.on("close", async (code) => {
    result = JSON.parse(result);

    res.render("index", {
      movies: await movieAPI.getMoviesById(result["tmdbId"]),
      recommend: result,
      user: req.user,
    });
  });
    // res.render("index", {
    //   movies: testMovies,
    //   user: req.user,
    // });
};

module.exports = {
  getHomePage,
};

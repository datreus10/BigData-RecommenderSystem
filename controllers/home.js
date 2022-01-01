const movieAPI = require("../helper/movieAPI");
const {
  spawn
} = require("child_process");

const testMovies = [
  "Toy Story (1995)",
  "Jumanji (1995)",
  "Grumpier Old Men (1995)",
  "Waiting to Exhale (1995)",
  "Father of the Bride Part II (1995)",
];

const getHomePage = (req, res, next) => {
  const userId = req.query.userId || 1;

  let result;

  const python = spawn("python", ["./recommendation/loadRec.py", userId]);
  // collect data from script
  python.stdout.on("data", function (data) {
    result += data.toString();
  });
  // in close event we are sure that stream from child process is closed
  python.on("close", async (code) => {

    try {
      const idx1 = result.indexOf("{")
      const idx2 = result.indexOf("}")
      if (idx1 > -1 && idx2 > -1)
        result = result.substring(idx1, idx2 + 1)
      result = JSON.parse(result);
    } catch (error) {
      console.log(error)
    } finally {
      res.send(result);
    }

    // res.render("index", {
    //   movies: await movieAPI.getMoviesById(result["tmdbId"]),
    //   recommend: result,
    //   user: req.user,
    // });
  });
  // res.render("index", {
  //   movies: testMovies,
  //   user: req.user,
  // });
};

module.exports = {
  getHomePage,
};
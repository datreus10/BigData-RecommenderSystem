var express = require("express");
var router = express.Router();
const { spawn } = require("child_process");

/* GET home page. */
router.get("/", function callName(req, res) {
  var data2;
  // spawn new child process to call the python script
  const python = spawn("python3", [
    "./recommendation/test.py",
    req.query.userId,
  ]);
  // collect data from script
  python.stdout.on("data", function (data) {
    console.log("Pipe data from python script ...");
    data2 = data.toString();
  });
  // in close event we are sure that stream from child process is closed
  python.on("close", (code) => {
    console.log(`child process close all stdio with code ${code}`);
    // send data to browser
    res.send(data2);
  });
});

module.exports = router;

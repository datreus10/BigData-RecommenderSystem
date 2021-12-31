var express = require("express");
var router = express.Router();
const { spawn } = require("child_process");

/* GET home page. */
router.get("/",   function callName(req, res) {
    var spawn = require("child_process").spawn;
      
    var process = spawn('python',["./recommendation/test.py"]);
  
    process.stdout.on('data', function(data) {
        res.send(data.toString());
    } )
});

module.exports = router;

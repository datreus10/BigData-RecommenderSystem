var express = require("express");
var router = express.Router();
const { spawn } = require("child_process");

/* GET home page. */
router.get("/",   function callName(req, res) {
    let result;
    var spawn = require("child_process").spawn;
      
    var process = spawn('python',["./recommendation/test.py"]);
  
    process.stdout.on('data', async function(data) {
        result= await data.toString()
    } )
    res.send(result);
});

module.exports = router;

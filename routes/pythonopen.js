var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function callName(req, res) {
      
    //res.send("hello")
    // Use child_process.spawn method from 
    // child_process module and assign it
    // to variable spawn
    var spawn = require("child_process").spawn;
      
    // Parameters passed in spawn -
    // 1. type_of_script
    // 2. list containing Path of the script
    //    and arguments for the script 
      
    // E.g : http://localhost:3000/name?firstname=Mike&lastname=Will
    // so, first name = Mike and last name = Will
    var process = spawn('python',["./recommendation/recommentmovie.py",
                            req.query.firstname,
                            req.query.lastname] );
  
    // Takes stdout data from script which executed
    // with arguments and send this data to res object
    process.stdout.on('data', function(data) {
        res.send(data.toString());
    } )
});



module.exports = router;

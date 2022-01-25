var express = require("express");
var router = express.Router();
const { getHomePage } = require("../controllers/home");
const { verifytoken } = require("../middleware/auth");
/* GET home page. */
router.get("/", verifytoken, getHomePage);
router.get("/about", verifytoken, (req, res, next) => {
  res.render("about", {
    user: req.user,
  });
});

module.exports = router;

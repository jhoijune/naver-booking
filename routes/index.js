const express = require("express");
const path = require("path");
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect("mainpage.html");
});

module.exports = router;

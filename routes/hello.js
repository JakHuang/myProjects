var express = require('express');
var router = express.Router();

/* GET hello page. */
router.get('/', function(req, res, next) {
  res.sendfile("./public/html/hello.html");
});

module.exports = router;
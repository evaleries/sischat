var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.json({error: true, message: 'Route not found'}).status(404);
});

module.exports = router;

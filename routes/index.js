const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // 以json的格式输出
  res.json({message: 'Hello Node.js!'});
});

module.exports = router;

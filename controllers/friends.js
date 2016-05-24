var express = require('express');
var router = express.Router();

router.get('/:provider/friends', function (req, res) {
  res.render('friends');
});

module.exports = router;

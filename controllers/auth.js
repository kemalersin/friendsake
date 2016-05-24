var express = require('express');
var router = express.Router();

var passport = require('passport');
require('../config/passport')(passport);

router.get('/auth/facebook', passport.authenticate(
  'facebook', {
    session: true,
    scope: ['email', 'user_friends']
  }
));

router.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/facebook/friends',
  failureRedirect: '/'
}));


module.exports = router;

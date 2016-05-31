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

router.get('/auth/twitter', passport.authenticate('twitter'));

router.get('/auth/twitter/callback', passport.authenticate('twitter', {
  successRedirect: '/twitter/friends',
  failureRedirect: '/',
}));

module.exports = router;

var configAuth = require('./auth');
var User = require('../models/user');
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, {
        id: user.id,
        facebook: user.facebook,
        twitter: user.twitter
      });
    });
  });

  passport.use(new FacebookStrategy({
      clientID: configAuth.facebook.clientID,
      clientSecret: configAuth.facebook.clientSecret,
      callbackURL: configAuth.facebook.callbackURL,
      profileFields: ['id', 'email', 'first_name', 'last_name', 'gender'],
    },
    function(token, refreshToken, profile, done) {
      process.nextTick(function() {
        User.findOne({ 'facebook.id': profile.id }, function(err, user) {
          if (err) {
            return done(err);
          }

          if (!user) {
            user = new User();
          }

          user.facebook.id = profile.id;
          user.facebook.token = token;
          user.facebook.gender = profile.gender;
          user.facebook.givenName = profile.name.givenName;
          user.facebook.familyName = profile.name.familyName;

          user.facebook.email = (
            !_.isUndefined(profile.emails) && _.size(profile.emails) !== 0 ?
              profile.emails[0].value : ''
          ).toLowerCase();

          user.save(function(err) {
            if (err) {
              throw err;
            }

            return done(null, user);
          });
        });
      });
    }));

  passport.use(new TwitterStrategy({
      consumerKey: configAuth.twitter.consumerKey,
      consumerSecret: configAuth.twitter.consumerSecret,
      callbackURL: configAuth.twitter.callbackURL,
    },
    function(token, tokenSecret, profile, done) {
      process.nextTick(function() {
        User.findOne({ 'twitter.id': profile.id }, function(err, user) {
          if (err) {
            return done(err);
          }

          if (!user) {
           user = new User();
          }

          user.twitter.id = profile.id;
          user.twitter.token = token;
          user.twitter.tokenSecret = tokenSecret;
          user.twitter.username = profile.username;
          user.twitter.displayName = profile.displayName;

          user.save(function(err) {
            if (err) {
              throw err;
            }

            return done(null, user);
          });
        });
      });
    }));
};

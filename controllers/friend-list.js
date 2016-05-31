var express = require('express');
var router = express.Router();

var request = require('request');
var random = require('randomstring');

var User = require('../models/user');
var configAuth = require('../config/auth');
var generator = require('../helpers/image-generator');

router.get('/:provider/friends/list', function (req, res, next) {
  var cursor;
  var result = [];
  var provider = _.lowerCase(req.params.provider);

  req.session.uid = random.generate(8);

  var fnGenerate = function (friends, history, user) {
    return function (info) {
      history.image = info.image;
      history.title = info.title;
      history.description = info.description;

      user.save();

      res.json({
        info: info,
        friends: friends,
        url: req.protocol +
        '://' + req.headers.host +
        '/' + provider +
        '/profile/' + req.user[provider].id +
        '?uid=' + req.session.uid
      });
    }
  }

  var fnUser = function (friends) {
    return function (err, user) {
      var mostCommon = _.head(friends);

      var i = user.history.push({
        uid: req.session.uid,
        provider: provider,
        name: mostCommon.name,
        number: _.size(mostCommon.users),
        createdAt: _.now()
      });

      var history = user.history[--i];

      generator.generate(
        history.name,
        history.number,
        fnGenerate(friends, history, user)
      );
    }
  }

  var fnResponse = function (parse, cursorKey) {
    return function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var obj = JSON.parse(body);

        if (obj) {
          result = _.concat(result, parse(obj));

          if (!_.isUndefined(cursorKey) && _.hasIn(obj, cursorKey) && obj[cursorKey]) {
            cursor = _.toString(obj[cursorKey]);
            execute();
            return;
          }
        }
      }

      if (_.size(result) === 0) {
        res.send(404);
        return;
      }

      var grouped = _.chain(result)
        .sortBy(function (friend) {
          return _.chain(friend.name).lowerCase().deburr();
        })
        .groupBy(function (friend) {
          return _.chain(friend.name).words().head();
        })
        .toPairs()
        .map(function (friend) {
          return _.zipObject(['name', 'users'], friend);
        })
        .sortBy(function (obj) {
          return -obj.users.length;
        })
        .value();

      var singletons = _.filter(grouped, function (obj) {
        return _.size(obj.users) === 1;
      });

      var friends = _.concat(
        _.difference(grouped, singletons),
        [{
          name: __('onlyOne'),
          users: _.map(singletons, function (obj) {
            return _.head(obj.users);
          })
        }]
      );

      User.findById(req.user.id, fnUser(friends));
    }
  }

  var sendFriends = function (url, parse, cursorKey) {
    request(url, fnResponse(parse, cursorKey));
  }

  var sendFBFriends = function () {
    sendFriends(
      'https://graph.facebook.com/v2.6/' + req.user.facebook.id +
      '/invitable_friends?limit=5000&access_token=' + req.user.facebook.token,
      function (obj) {
        return _.transform(obj.data, function (result, value) {
          result.push({
            name: value.name,
            picture: value.picture.data.url
          });
        }, []);
      }
    );
  }

  var sendTwitterFriends = function () {
    sendFriends({
        url: 'https://api.twitter.com/1.1/friends/list.json?screen_name=' + req.user.twitter.username +
             '&skip_status=true&include_user_entities=false&count=200&cursor=' +
             (_.isUndefined(cursor) ? '-1' : cursor),
        oauth: {
          consumer_key: configAuth.twitter.consumerKey,
          consumer_secret: configAuth.twitter.consumerSecret,
          token: req.user.twitter.token,
          token_secret: req.user.twitter.tokenSecret
        }
      },
      function (obj) {
        return _.transform(obj.users, function (result, value) {
          result.push({
            name: value.name,
            picture: value.profile_image_url,
            url: 'https://www.twitter.com/' + value.screen_name
          });
        }, []);
      },
      'next_cursor'
    );
  }

  var execute = function () {
    switch (provider) {
      case 'facebook':
        sendFBFriends();
        break;
      case 'twitter':
        sendTwitterFriends();
        break;
    }
  }

  execute();
});

module.exports = router;

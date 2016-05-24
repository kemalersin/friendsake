var express = require('express');
var router = express.Router();

var async = require('async');
var request = require('request');
var random = require('randomstring');

var User = require('../models/user');
var generator = require('../helpers/image-generator');

router.get('/:provider/friends/list', function (req, res, next) {
  var provider = _.lowerCase(req.params.provider);

  var sendFriends = function (url, parse) {
    request(url, function (error, response, body) {
      var friends = [];

      if (!error && response.statusCode == 200) {
        var obj = JSON.parse(body);

        if (obj) {
          friends = parse(obj);
        }
      }

      var grouped = _.chain(friends)
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

      var result = _.concat(
        _.difference(grouped, singletons),
        [{
          name: __('onlyOne'),
          users: _.map(singletons, function (obj) {
            return _.head(obj.users);
          })
        }]
      );

      req.session.uid = random.generate(8);

      User.findById(req.user.id, function (err, user) {
        var mostCommon = _.head(result);

        var i = user.history.push({
          uid: req.session.uid,
          provider: provider,
          name: mostCommon.name,
          number: _.size(mostCommon.users),
          createdAt: _.now()
        });

        var history = user.history[--i];

        generator.generate(history.name, history.number, function (image, title, description) {
          history.image = image;
          history.title = title;
          history.description = description;

          user.save();

          res.json({
            friends: result,
            image: image,
            title: title,
            description: description,
            url: req.protocol +
              '://' + req.headers.host +
              '/' + provider +
              '/profile/' + req.user[provider].id +
              '?uid=' + req.session.uid
          });
        });
      });
    });
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

  switch (provider) {
    case 'facebook':
      sendFBFriends();
      break;
  }
});

module.exports = router;

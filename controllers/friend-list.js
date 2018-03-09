var express = require('express');
var router = express.Router();

var request = require('request');
var random = require('randomstring');

var User = require('../models/user');
var generator = require('../helpers/image-generator');

router.get('/:provider/friends/list', function (req, res, next) {
  var provider = _.lowerCase(req.params.provider);

  req.session.uid = random.generate(8);

  var sendFriends = function (url, parse) {
    new Promise(function (resolve, reject) {
      request(url, function (error, response, body) {
        if (error) {
          reject(error);
        }
        else {
          var result = [];
          var obj = JSON.parse(body);

          if (obj) {
            result = parse(obj);
          }

          if (_.size(result) === 0) {
            reject(__('notFound'));
          }
          else {
            resolve(result);
          }
        }
      });
    })
    .then(function (result) {
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

      return _.concat(
        _.difference(grouped, singletons),
        [{
          name: __('onlyOne'),
          users: _.map(singletons, function (obj) {
            return _.head(obj.users);
          })
        }]
      );
    })
    .then(function (friends) {
      User.findById(req.user.id, function (error, user) {
        var mostCommon = _.head(friends);

        var i = user.history.push({
          uid: req.session.uid,
          provider: provider,
          name: mostCommon.name,
          number: _.size(mostCommon.users),
          createdAt: _.now()
        });

        var history = user.history[--i];

        generator
          .generate(history.name, history.number)
          .then(function (info) {
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
          });
      });
    })
    .catch(function(error) {
      res.status(500).send(error);
    });
  }

  var sendFBFriends = function () {
    sendFriends(
      'https://graph.facebook.com/v2.6/' + req.user.facebook.id +
      '/taggable_friends?limit=5000&access_token=' + req.user.facebook.token,
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

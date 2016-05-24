var express = require('express');
var router = express.Router();

var User = require('../models/user');

router.get('/:provider/profile/:id', function (req, res, next) {
  var uid = req.query.uid;
  var provider = _.lowerCase(req.params.provider);

  User.findOne({ $where: 'this.' + provider + '.id == ' + req.params.id },
    function (err, user) {
      var history = (err || !user) ? undefined :
        _.find(user.history, function(o) {
          return o.uid === uid &&
            o.provider == provider;
        });

      if (_.isUndefined(history)) {
        next();
      }
      else {
        res.render('profile', {
          url: req.originalUrl,
          image: history.image,
          title: history.title,
          description: history.description,
          fbAppId: process.env.FB_APP_ID,
        });
      }
    });
});

module.exports = router;

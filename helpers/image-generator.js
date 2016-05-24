const defaultId = '14gwq6';

var async = require('async');
var request = require('request');

var Template = require('../models/template');

module.exports = {
  generate: function (name, number, callback) {
    var setText = function (text) {
      return text
        .replace(/#name/g, name)
        .replace(/#number/g, number);
    }

    async.waterfall([
      function (callback) {
        Template.find({}, function (err, templates) {
          if (err || _.isEmpty(templates)) {
            callback(null, '', '');
          }
          else {
            var uid = null;
            var n = _.random(0, _.size(templates) - 1);

            var template = templates[n];
            var info = template[getLocale()] || template['tr-TR'];

            var title = setText(info.title);
            var description = setText(info.description);

            request.post({
              url: 'https://api.imgflip.com/caption_image',
              form: {
                template_id: template.id,
                username: process.env.IMGFLIP_USERNAME,
                password: process.env.IMGFLIP_PASSWORD,
                boxes: [{
                  text: title,
                  x: 10,
                  y: 28,
                  width: 775,
                  height: 60
                }, {
                  text: description,
                  x: 10,
                  y: 502,
                  width: 775,
                  height: 60
                }]
              }
            }, function (err, response, body) {
              if (!err /* && response.statusCode == 200 */) {
                var result = JSON.parse(body);

                if (result.success) {
                  uid = _.chain(result.data.page_url)
                    .split('/').pop();
                }
              }

              callback(null, uid, title, description);
            });
          }
        });
      },
      function (uid, title, description) {
        var url = 'http://i.imgflip.com/' + (
            uid ? uid : defaultId
          ) + '.jpg';

        callback(url, title, description);
      }
    ]);
  }
}

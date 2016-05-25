const defaultId = '14gwq6';

var request = require('request');
var Template = require('../models/template');

module.exports = {
  generate: function (name, number, callback) {
    var setText = function (text) {
      return text
        .replace(/#name/g, name)
        .replace(/#number/g, number);
    }

    var fnResponse = function (title, description) {
      return function (err, response, body) {
        var uid = null;

        if (!err /* && response.statusCode == 200 */) {
          var result = JSON.parse(body);

          if (result.success) {
            uid = _.chain(result.data.page_url)
              .split('/').pop();
          }
        }

        callback({
          title: title,
          description: description,
          image: 'https://i.imgflip.com/' + (
            uid ? uid : defaultId
          ) + '.jpg'
        });
      }
    }

    var fnTemplate = function (err, templates) {
      var n = _.random(0, _.size(templates) - 1);

      var template = templates[n];
      var info = template[getLocale()] || template['tr-TR'];

      var title = setText(info.title);
      var description = setText(info.description);

      var data = {
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
      };

      request.post(data, fnResponse(title, description));
    }

    Template.find({}, fnTemplate);
  }
}

const defaultId = '14gwq6';

var request = require('request');
var Template = require('../models/template');

module.exports = {
  generate: function (name, number) {
    var setText = function (text) {
      return text
        .replace(/#name/g, name)
        .replace(/#number/g, number);
    }
    
    var promise = function (resolve, reject) {
      Template.find({}, function (error, templates) {
        if (error) {
          reject(error);
        }
        else {
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

          request.post(data, function (error, response, body) {
            var uid = null;

            if (error) {
              reject(error);
            }
            else {
              var result = JSON.parse(body);

              if (result.success) {
                uid = _.chain(result.data.page_url)
                  .split('/').pop();
              }

              resolve({
                title: title,
                description: description,
                image: 'https://i.imgflip.com/' + (
                  uid ? uid : defaultId
                ) + '.jpg'
              });
            }
          });
        }
      });
    }

    return new Promise(promise);
  }
}

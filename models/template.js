var mongoose = require('mongoose');

var templateSchema = mongoose.Schema({
  'id': String,
  'tr-TR': {
    'title': String,
    'description': String
  }
});

module.exports = mongoose.model('Template', templateSchema);

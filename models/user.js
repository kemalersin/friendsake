var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  facebook: {
    id: String,
    token: String,
    email: String,
    gender: String,
    givenName: String,
    familyName: String,
  },
  history: [{
    _id : false,
    uid: String,
    name: String,
    number: String,
    image: String,
    title: String,
    description: String,
    provider: String,
    createdAt: Date
  }]
},{
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);

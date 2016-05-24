var i18n = require('i18n');
var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/config');

var app = express();
var db = mongoose.connection;
var env = process.env.NODE_ENV || 'development';

global._ = require('lodash');

app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';

i18n.configure({
  defaultLocale: 'en',
  directory: config.root + '/public/i18n',
  register: global
});

require('./config/express')(app, config);

mongoose.connect(config.db);

db.on('error', function () {
  throw new Error('Unable to connect to database at ' + config.db);
});

app.listen(config.port, function () {
  console.log('Express server listening on port ' + config.port);
});


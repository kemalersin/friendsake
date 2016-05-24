var express = require('express');
var glob = require('glob');
var i18n = require('i18n');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compress = require('compression');
var methodOverride = require('method-override');
var passport = require('passport');
var session = require('express-session');

module.exports = function(app, config) {
  var controllers = glob.sync(config.root + '/controllers/*.js');

  app.set('views', config.root + '/views');
  app.set('view engine', 'jade');

  app.use(logger('dev'));
  app.use(bodyParser.json());

  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(cookieParser());
  app.use(compress());
  app.use(express.static(config.root + '/public'));
  app.use(methodOverride());

  app.use(session({ secret: process.env.SSH_SECRET }));
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(favicon(config.root + '/public/img/favicon.ico'));

  app.use(function (req, res, next) {
    var Negotiator = require('negotiator');
    var lang = new Negotiator(req).language();

    i18n.setLocale(lang);

    next();
  });

  app.use('/:provider/friends', function (req, res, next) {
    if (_.isUndefined(req.user)) {
      res.redirect('/');
    }
    else {
      next();
    }
  });

  controllers.forEach(function (controller) {
    app.use(require(controller));
  });

  app.use(function (req, res, next) {
    var err = new Error(__('notFound'));
    err.status = 404;
    next(err);
  });

  if(app.get('env') === 'development'){
    app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        error: err,
        message: err.message,
        title: __('error')
      });
    });
  }

  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      error: {},
      message: err.message,
      title: __('error')
    });
  });
};

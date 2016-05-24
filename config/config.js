require('dotenv').config();

var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'friendsake'
    },
    port: process.env.PORT,
    db: process.env.DEV_MONGODB
  },

  test: {
    root: rootPath,
    app: {
      name: 'friendsake'
    },
    port: process.env.PORT,
    db: process.env.TEST_MONGODB
  },

  production: {
    root: rootPath,
    app: {
      name: 'friendsake'
    },
    port: process.env.PORT,
    db: process.env.PROD_MONGODB
  }
};

module.exports = config[env];

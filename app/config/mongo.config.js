/*
 * mongo.config.js: GNU GENERAL PUBLIC LICENSE Version 3
 */
(function() {
  'use strict';

  /**
   * Mongo DB configuration module.
   * 
   * @author Gerry Gehrmann
   * @since 0.0.1
   * @module
   * @class
   * @name MongoConfig
   */
  module.exports = function(messageBus) {

    /** ******************************** */
    /** ********* Node modules ********* */
    /** ******************************** */
    var mongoose = require('mongoose');
    var winston = require('winston');

    /** ******************************** */
    /** **** Configuration modules ***** */
    /** ******************************** */
    var dbConfig = require('config').get('database');

    /** ******************************** */
    /** ****** Controller modules ****** */
    /** ******************************** */
    var setupConfig = require('./setup.config')(messageBus);

    /** ******************************** */
    /** *** Bootstrap DB connection **** */
    /** ******************************** */

    mongoose.connect('mongodb://' + dbConfig.user + ':' + dbConfig.password + '@' + dbConfig.host + ':' + dbConfig.port + '/' + dbConfig.schema, {}, function(err) {
      if (err) {
        winston.error(err);
        winston.error('Could not connect to MongoDB!');
        process.exit(-1);
      }

      winston.info('Connected to MongoDB');
      setupConfig.checkSetup(function(err) {
        if (err) {
          throw err;
        }
      });
    });

    mongoose.connection.on('error', function(err) {
      winston.error('MongoDB connection error: ' + err);
      process.exit(-1);
    });

  };
})();
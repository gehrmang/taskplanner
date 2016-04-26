/*
 * mongo.config.js: Copyright (C) 2015 Gerry Gehrmann. All rights reserved. Use
 * is subject to JASP license terms.
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
    /** *** Bootstrap DB connection **** */
    /** ******************************** */

    var db = mongoose.connect('mongodb://' + dbConfig.user + ':' + dbConfig.password + '@' + dbConfig.host + ':' + dbConfig.port + '/' + dbConfig.schema, {}, function(err) {
      if (err) {
        winston.error(err);
        winston.error('Could not connect to MongoDB!');
        process.exit(-1);
      }

      winston.info('Connected to MongoDB');
    });

    mongoose.connection.on('error', function(err) {
      winston.error('MongoDB connection error: ' + err);
      process.exit(-1);
    });

  };
})();
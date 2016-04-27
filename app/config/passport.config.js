/*
 * passport.config.js: GNU GENERAL PUBLIC LICENSE Version 3
 */
(function() {
  'use strict';

  /**
   * Configuration for passport.
   * 
   * @author Gerry Gehrmann
   * @since 0.0.1
   * @module
   */

  /** ******************************** */
  /** ********* Node modules ********* */
  /** ******************************** */
  var winston = require('winston');
  var passport = require('passport');
  var LocalStrategy = require('passport-local').Strategy;
  var BasicStrategy = require('passport-http').BasicStrategy;

  /** ******************************** */
  /** ******* MongoOSE Models ******** */
  /** ******************************** */
  var User = require('../models/user.model');

  /** ******************************** */
  /** ***** Passport definitions ***** */
  /** ******************************** */
  // Use static authenticate method of model in LocalStrategy and BasicStrategy
  passport.use(new LocalStrategy(User.authenticate()));
  passport.use(new BasicStrategy(User.authenticate()));

  // Use static serialize and deserialize of model for passport session
  // support
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());

  winston.info('Passport initialized');
})();
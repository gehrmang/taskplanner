/*
 * setup.config.js: GNU GENERAL PUBLIC LICENSE Version 3
 */
(function() {
  'use strict';

  /**
   * Setup of initial data.
   * 
   * @author Gerry Gehrmann
   * @since 0.0.1
   * @named SetupConfig
   */

  /** ******************************** */
  /** ********* Node modules ********* */
  /** ******************************** */
  var winston = require('winston');

  /** ******************************** */
  /** ******* MongoOSE Models ******** */
  /** ******************************** */
  var User = require('../models/user.model');


  /** ******************************** */
  /** ***** Data initialization ****** */
  /** ******************************** */

  module.exports = function(messageBus) {

    /**
     * The service interface
     * 
     * @fieldOf SetupConfig#
     * @private
     * @interface
     */
    var service = {
      checkSetup: checkSetup
    };

    return service;

    /**
     * Check if data setup is required. This is done by looking for existing
     * users. If no user is found setup is required.
     * 
     * @memberOf SetupConfig#
     */
    function checkSetup(callback) {
      User.find(function(err, result) {
        if (err) {
          throw err;
        }

        if (result.length === 0) {
          _setupInitialAdmin(callback);
        } else {
          callback(null);
        }
      });
    }

    /**
     * Create the initial admin user and save it to the database.
     * 
     * @memberOf SetupConfig#
     * @private
     */
    function _setupInitialAdmin(callback) {
      var newUser = User({
        "username": "admin",
        "name": "Admin",
        "firstname": "Admin",
        "language": "en_US"
      });
      newUser.setPassword('12345', function() {
        // save the user
        newUser.save(function(err) {
          if (err) {
            throw err;
          }

          winston.info('Initial admin user created!');
          callback();
        });
      });
    }
    
  };
})();
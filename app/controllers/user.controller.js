/*
 * user.controller.js: GNU GENERAL PUBLIC LICENSE Version 3
 */
(function() {
  "use strict";

  /** ******************************** */
  /** ********* Node modules ********* */
  /** ******************************** */
  var winston = require('winston');

  /** ******************************** */
  /** ******* MongoOSE Models ******** */
  /** ******************************** */
  var User = require('../models/user.model');

  /**
   * User controller.
   * 
   * @author Gerry Gehrmann
   * @since 0.0.1
   * @module
   * @class
   * @name UserController
   */
  module.exports = function() {

    /**
     * The service interface
     * 
     * @fieldOf UserController#
     * @private
     * @interface
     */
    var service = {
      save: save,
      changePassword: changePassword
    };

    return service;

    /**
     * Save a given user.
     * 
     * @memberOf UserController#
     * @param {Object} req - The HTTP request
     * @param {Object} res - The HTTP response
     */
    function save(req, res) {
      var user = req.body.user;

      if (user._id) {
        User.update({
          _id: user._id
        }, {
          $set: {
            firstname: user.firstname,
            name: user.name,
            email: user.email,
            language: user.language,
            updated_at: new Date()
          }
        }, function(err) {
          if (err) {
            winston.error(err);
            res.status(500).send(err);
            return;
          }

          res.sendStatus(200);
        });
      } else {
        new User(user).save(function(err, result) {
          if (err) {
            winston.error(err);
            res.status(500).send(err);
            return;
          }

          res.send(result);
        });
      }
    }

    /**
     * Change the current user's password.
     * 
     * @memberOf UserController#
     * @param {Object} req - The HTTP request
     * @param {Object} res - The HTTP response
     */
    function changePassword(req, res) {
      var user = req.body.user;
      var newPass = req.body.password;

      User.findOne({
        _id: user._id
      }, function(err, result) {
        if (err) {
          winston.error(err);
          res.status(500).send(err);
          return;
        }

        result.setPassword(newPass, function() {
          result.save(function(err) {
            if (err) {
              winston.error(err);
              res.status(500).send(err);
              return;
            }

            res.sendStatus(200);
          });
        });
      });
    }
  };
})();
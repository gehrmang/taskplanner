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
      list: list,
      getUser: getUser,
      save: save,
      removeUser: removeUser,
      changePassword: changePassword
    };

    return service;

    /**
     * List all available users.
     * 
     * @memberOf UserController#
     * @param {Object} req - The HTTP request
     * @param {Object} res - The HTTP response
     */
    function list(req, res) {
      User.find({}, function(err, result) {
        if (err) {
          winston.error(err);
          res.status(500).send(err);
          return;
        }

        res.send(result);
      });
    }

    /**
     * Get a user by its username.
     * 
     * @memberOf UserController#
     * @param {Object} req - The HTTP request
     * @param {Object} res - The HTTP response
     */
    function getUser(req, res) {
      var username = req.query['u'];

      if (!username) {
        res.send();
        return;
      }

      User.findOne({
        username: username
      }, function(err, result) {
        if (err) {
          winston.error(err);
          res.status(500).send(err);
          return;
        }

        res.send(result);
      });
    }

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

          if (user.newPassword) {
            updatePassword(user._id, user.newPassword, function(err) {
              if (err) {
                winston.error(err);
                res.status(500).send(err);
                return;
              }

              res.sendStatus(200);
            });
            return;
          }

          res.sendStatus(200);
        });
      } else {
        var newUser = new User(user);
        newUser.setPassword(user.newPassword, function() {
          // save the user
          newUser.save(function(err, result) {
            if (err) {
              winston.error(err);
              res.status(500).send(err);
              return;
            }

            res.send(result);
          });
        });
      }
    }

    /**
     * Remove a given user.
     * 
     * @memberOf UserController#
     * @param {Object} req - The HTTP request
     * @param {Object} res - The HTTP response
     */
    function removeUser(req, res) {
      User.remove({
        username: req.query['u']
      }, function(err) {
        if (err) {
          winston.error(err);
          res.status(500).send(err);
          return;
        }

        res.sendStatus(200);
      });
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

      updatePassword(user._id, newPass, function(err) {
        if (err) {
          winston.error(err);
          res.status(500).send(err);
          return;
        }

        res.sendStatus(200);
      });
    }

    /**
     * Set the password of a specific user.
     * 
     * @memberOf UserController#
     * @private
     * @param {string} userId - The ID of a user
     * @param {string} password - The new password to be set
     * @callback callback
     */
    function updatePassword(userId, password, callback) {
      User.findOne({
        _id: userId
      }, function(err, result) {
        if (err) {
          callback(err);
          return;
        }

        result.setPassword(password, function() {
          result.save(callback);
        });
      });

    }
  };
})();
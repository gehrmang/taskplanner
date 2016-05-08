/*
 * auth.controller.js: GNU GENERAL PUBLIC LICENSE Version 3
 */
(function() {
  "use strict";

  /** ******************************** */
  /** ********* Node modules ********* */
  /** ******************************** */
  var winston = require('winston');
  var passport = require('passport');
  var jwt = require("jsonwebtoken");
  var atob = require("atob");

  /**
   * User authentication controller.
   * 
   * @author Gerry Gehrmann
   * @since 0.0.1
   * @module
   * @class
   * @name AuthController
   */
  module.exports = function() {

    /**
     * The service interface
     * 
     * @fieldOf AuthController#
     * @private
     * @interface
     */
    var service = {
      checkAuth: checkAuth,
      login: login,
      logout: logout,
      loadUser: loadUser
    };

    return service;

    /**
     * Check if the current user is authenticated. Will be used as middleware
     * for secured routes.
     * 
     * @memberOf AuthController#
     * @param {Object} req - The HTTP request
     * @param {Object} res - The HTTP response
     * @param {Object} next - The next middleware
     */
    function checkAuth(req, res, next) {
      if (!req.isAuthenticated()) {
        passport.authenticate('basic', function(err, user, info) {
          if (err) {
            winston.error(err);
            return next(err);
          }
          if (!user) {
            return res.status(401).send();
          }

          req.logIn(user, function(err) {
            if (err) {
              winston.error(err);
              return next(err);
            }

            next();
          });
        })(req, res, next);
      } else {
        var currentUser = req.user;

        var bearerHeader = req.headers["authorization"];
        if (typeof bearerHeader !== 'undefined') {
          var bearer = bearerHeader.split(" ");
          var bearerToken = bearer[1];

          if (bearerToken && currentUser) {
            var decodedToken = jwt.verify(bearerToken, 'secret-to-be-replaced');
            if (decodedToken.id == currentUser._id) {
              req.token = bearerToken;
              next();
              return;
            }
          }
        }

        var bearerQuery = req.query['t'];
        if (typeof bearerQuery !== 'undefined') {
          var bearer = atob(bearerQuery).split(" ");
          var bearerToken = bearer[1];

          if (bearerToken && currentUser) {
            var decodedToken = jwt.verify(bearerToken, 'secret-to-be-replaced');
            if (decodedToken.id == currentUser._id) {
              req.token = bearerToken;
              next();
              return;
            }
          }
        }

        res.status(401).send();
      }
    }

    /**
     * Login a user.
     * 
     * @memberOf AuthController#
     * @param {Object} req - The HTTP request
     * @param {Object} res - The HTTP response
     * @param {Object} next - The next middleware
     */
    function login(req, res, next) {
      passport.authenticate('local', function(err, user, info) {
        if (err) {
          winston.error(err);
          return next(err);
        }
        if (!user) {
          res.status(401).send();
          return;
        }

        req.logIn(user, function(err) {
          if (err) {
            winston.error(err);
            return next(err);
          }

          var token = jwt.sign({
            id: user._id
          }, 'secret-to-be-replaced');

          res.json(buildJsonUser(user, token));
        });
      })(req, res, next);
    }

    /**
     * Logout the current user. As result, an anonymous dummy user will be send
     * back.
     * 
     * @memberOf AuthController#
     * @param {Object} req - The HTTP request
     * @param {Object} res - The HTTP response
     */
    function logout(req, res) {
      req.logOut();
      res.sendStatus(200);
    }

    /**
     * Load the currently authenticated user by its token.
     * 
     * @memberOf AuthController#
     * @param {Object} req - The HTTP request
     * @param {Object} res - The HTTP response
     */
    function loadUser(req, res) {
      var token = req.body.token;
      var currentUser = req.user;

      if (token && currentUser) {
        var decodedToken = jwt.verify(token, 'secret-to-be-replaced');
        if (decodedToken.id == currentUser._id) {
          res.json(buildJsonUser(currentUser, token));
          return;
        }
      }

      res.sendStatus(200);
    }

    /**
     * Build the JSON return value from the given user.
     * 
     * @memberOf AuthController#
     * @param {Object} user - The authenticated user
     * @param {Object} token - The generated json web token
     */
    function buildJsonUser(user, token) {
      return {
        user: {
          _id: user._id,
          username: user.username,
          firstname: user.firstname,
          name: user.name,
          language: user.language,
          email: user.email
        },
        token: token
      };
    }
  };

})();
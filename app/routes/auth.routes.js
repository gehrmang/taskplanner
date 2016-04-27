/*
 * auth.routes.js: Copyright (C) 2015 Gerry Gehrmann. All rights reserved. Use
 * is subject to JASP license terms.
 */
(function() {
  "use strict";

  /**
   * Routes for authentication
   * 
   * @author Gerry Gehrmann
   * @since 0.0.1
   * @module
   */

  /** ******************************** */
  /** ********* Node modules ********* */
  /** ******************************** */
  var express = require('express');
  var router = express.Router();

  /** ******************************** */
  /** ****** Controller modules ****** */
  /** ******************************** */
  var authController = require('../controllers/auth.controller')();

  /** ******************************** */
  /** ****** Route definitions ******* */
  /** ******************************** */
  // Login a user
  router.post('/login', authController.login);
  // Logout the current user
  router.post('/logout', authController.logout);
  // Load a user by its token
  router.post('/loaduser', authController.loadUser);

  // Make the routes available to the Node application
  module.exports = router;
})();
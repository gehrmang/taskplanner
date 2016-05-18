/*
 * user.routes.js: GNU GENERAL PUBLIC LICENSE Version 3
 */
(function() {
  "use strict";

  /**
   * Routes for user related requests
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
  var userController = require('../controllers/user.controller')();

  /** ******************************** */
  /** ****** Route definitions ******* */
  /** ******************************** */
  // Get all available users
  router.get('/list', authController.checkAuth, userController.list);
  // Save a given user
  router.post('/', authController.checkAuth, userController.save);
  // Change the password of a given user
  router.post('/chpass', authController.checkAuth, userController.changePassword);
  
  // Make the routes available to the Node application
  module.exports = router;
})();
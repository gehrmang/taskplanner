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
  router.get('/list', authController.checkAuth, authController.isAdminUser, userController.list);
  // Get a user by its username
  router.get('/user', authController.checkAuth, authController.isAdminUser, userController.getUser);
  // Save a given user
  router.post('/', authController.checkAuth, userController.save);
  // Change the password of a given user
  router.post('/chpass', authController.checkAuth, userController.changePassword);
  // Delete a given user
  router.delete('/', authController.checkAuth, authController.isAdminUser, userController.removeUser);
  
  // Make the routes available to the Node application
  module.exports = router;
})();
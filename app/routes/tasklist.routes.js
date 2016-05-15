/*
 * tasklist.routes.js: GNU GENERAL PUBLIC LICENSE Version 3
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
  var taskListController = require('../controllers/tasklist.controller')();

  /** ******************************** */
  /** ****** Route definitions ******* */
  /** ******************************** */
  // List all available task list of the current user
  router.get('/', authController.checkAuth, taskListController.list);
  // Export the tasks of a specific task list
  router.get('/export', authController.checkAuth, taskListController.exportTasks);
  // Save a given task list
  router.post('/', authController.checkAuth, taskListController.save);
  // Save the tasks of a specific task list
  router.post('/tasks', authController.checkAuth, taskListController.saveTasks);
  // Load a user by its token
  router.delete('/', authController.checkAuth, taskListController.remove);
  
  // Make the routes available to the Node application
  module.exports = router;
})();
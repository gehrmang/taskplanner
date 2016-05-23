/*
 * tasklist.routes.js: GNU GENERAL PUBLIC LICENSE Version 3
 */
(function() {
  "use strict";

  /**
   * Task list routes
   * 
   * @author Gerry Gehrmann
   * @since 0.0.1
   * @module
   * @param {Object} socket - The Socket.IO service
   */
  module.exports = function(socket) {

    /** ******************************** */
    /** ********* Node modules ********* */
    /** ******************************** */
    var express = require('express');
    var router = express.Router();

    /** ******************************** */
    /** ****** Controller modules ****** */
    /** ******************************** */
    var authController = require('../controllers/auth.controller')();
    var taskListController = require('../controllers/tasklist.controller')(socket);

    /** ******************************** */
    /** ****** Route definitions ******* */
    /** ******************************** */
    // List all available task list of the current user
    router.get('/', authController.checkAuth, taskListController.list);
    // List all shared task lists
    router.get('/shared', authController.checkAuth, taskListController.listShared);
    // Export the tasks of a specific task list
    router.get('/export', authController.checkAuth, taskListController.exportTasks);
    // Save a given task list
    router.post('/', authController.checkAuth, taskListController.save);
    // Save the tasks of a specific task list
    router.post('/tasks', authController.checkAuth, taskListController.saveTasks);
    // Add a watcher to a specific task lsit
    router.post('/watcher', authController.checkAuth, taskListController.addWatcher);
    // Remove a given task list
    router.delete('/', authController.checkAuth, taskListController.remove);
    // Stop watching a specific task list
    router.delete('/watcher', authController.checkAuth, taskListController.removeWatcher);

    // Make the routes available to the Node application
    return router;
  };
})();
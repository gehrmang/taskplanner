/*
 * tasklist.controller.js: GNU GENERAL PUBLIC LICENSE Version 3
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
  var TaskList = require('../models/tasklist.model');

  /**
   * User authentication controller.
   * 
   * @author Gerry Gehrmann
   * @since 0.0.1
   * @module
   * @class
   * @name TaskListController
   */
  module.exports = function() {

    /**
     * The service interface
     * 
     * @fieldOf TaskListController#
     * @private
     * @interface
     */
    var service = {
      list: list,
      listShared: listShared,
      save: save,
      saveTasks: saveTasks,
      remove: remove
    };

    return service;

    /**
     * List all task lists of the current user.
     * 
     * @memberOf TaskListController#
     * @param {Object} req - The HTTP request
     * @param {Object} res - The HTTP response
     */
    function list(req, res) {
      TaskList.find({
        owner: req.user._id
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
     * List all shared task lists of the current user.
     * 
     * @memberOf TaskListController#
     * @param {Object} req - The HTTP request
     * @param {Object} res - The HTTP response
     */
    function listShared(req, res) {

    }

    /**
     * Save a given task list.
     * 
     * @memberOf TaskListController#
     * @param {Object} req - The HTTP request
     * @param {Object} res - The HTTP response
     */
    function save(req, res) {
      var tl = req.body.taskList;

      if (tl._id) {
        TaskList.update({
          _id: tl._id
        }, {
          $set: {
            title: tl.title,
            tasks: tl.tasks,
            shareMode: tl.shareMode,
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
        tl.owner = req.user._id;
        new TaskList(tl).save(function(err, result) {
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
     * Save the tasks of a specific task list.
     * 
     * @memberOf TaskListController#
     * @param {Object} req - The HTTP request
     * @param {Object} res - The HTTP response
     */
    function saveTasks(req, res) {
      var taskListId = req.body.taskListId;
      var tasks = req.body.tasks;

      TaskList.update({
        _id: taskListId
      }, {
        $set: {
          tasks: tasks,
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
    }

    /**
     * Remove a given task list.
     * 
     * @memberOf TaskListController#
     * @param {Object} req - The HTTP request
     * @param {Object} res - The HTTP response
     */
    function remove(req, res) {
      var taskListId = req.query['tl'];

      TaskList.find({
        _id: taskListId
      }).remove(function(err) {
        if (err) {
          winston.error(err);
          res.status(500).send(err);
          return;
        }

        res.status(200).send();
      });
    }
  };
})();
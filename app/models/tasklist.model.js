/*
 * tasklist.model.js: GNU GENERAL PUBLIC LICENSE Version 3
 */
(function() {
  "use strict";

  /**
   * MongoDB model representing a task list.
   * 
   * @author Gerry Gehrmann
   * @since 0.0.1
   * @module
   */

  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;

  /**
   * The task list schema.
   * 
   * @class
   * @property {string} title - The task list title
   * @property {Object[]} tasks - An Array of tasks
   * @property {Date} created_at - The creation date
   * @property {Date} updated_at - The last update date
   */
  var taskListSchema = new Schema({
    title: {
      type: String,
      required: true
    },
    tasks: [{
      uuid: {
        type: String,
        required: true,
        unique: true
      },
      title: {
        type: String,
        required: true
      },
      dueDate: Date,
      done: Boolean
    }],
    owner: Schema.Types.ObjectId,
    shared: Boolean,
    created_at: Date,
    updated_at: Date
  });

  /**
   * Update the updated_at date before each save or update operation.
   * 
   * @param {Object} next - The next middleware
   */
  var preSave = function(next) {
    // get the current date
    var currentDate = new Date();

    // change the updated_at field to current date
    this.updated_at = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.created_at)
      this.created_at = currentDate;

    next();
  };

  // Set creation and modification dates before saving.
  taskListSchema.pre('save', preSave);

  // Create the final MongoOSE model
  var TaskList = mongoose.model('TaskList', taskListSchema);

  // Make the model available to the Node application
  module.exports = TaskList;

})();
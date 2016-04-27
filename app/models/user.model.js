/*
 * user.model.js: GNU GENERAL PUBLIC LICENSE Version 3
 */
(function() {
  "use strict";

  /**
   * MongoDB model representing a user.
   * 
   * @author Gerry Gehrmann
   * @since 0.0.1
   * @module
   */

  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;
  var passportLocalMongoose = require('passport-local-mongoose');

  /**
   * The user schema. Properties like username and password will be added by
   * passport.
   * 
   * @class
   * @property {string} email - The email address
   * @property {string} name - The name of the user
   * @property {string} firstname - The first name of the user
   * @property {string} language - The user language
   * @property {Date} created_at - The creation date
   * @property {Date} updated_at - The last update date
   */
  var userSchema = new Schema({
    email: String,
    name: {
      type: String,
      required: true
    },
    firstname: {
      type: String,
      required: true
    },
    language: {
      type: String,
      required: true
    },
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
  userSchema.pre('save', preSave);

  // Add the passport plugin to the model
  userSchema.plugin(passportLocalMongoose, {
    usernameField: 'username'
  });

  // Create the final MongoOSE model
  var User = mongoose.model('User', userSchema);

  // Make the model available to the Node application
  module.exports = User;

})();
/**
 *
 */

exports = module.exports = (function () {
  "use strict";

  /**
   *
   */
  var Project = function ( name ) {
    this.name = name;
    this.tasks = [];
    return this;
  };

  /**
   *
   */
  Project.prototype.addTask = function ( task ) {
    this.tasks.push ( task );
    return this;
  };

  /**
   *
   */
  Project.prototype.getPriority = function () {
    var priority = null;
    this.tasks.forEach ( function ( task ) {
      if ( task.priority && (!priority || task.priority < priority) ) {
        priority = task.priority;
      }
    });
    return priority;
  };

  return Project;

}(this));
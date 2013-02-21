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
  }

  Project.prototype.addTask = function ( task ) {
    this.tasks.push ( task );
    return this;
  }

  return Project;

}(this));
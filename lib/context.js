/**
 *
 */

exports = module.exports = (function () {
  "use strict";

  /**
   *
   */
  var Context = function ( name ) {
    this.name = name;
    this.tasks = [];
    return this;
  }

  Context.prototype.addTask = function ( task ) {
    this.tasks.push ( task );
    return this;
  }

  return Context;

}(this));
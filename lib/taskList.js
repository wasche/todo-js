/**
 *
 */

var Task = require('./task')
  , fs = require('fs')
  ;

exports = module.exports = (function () {
  "use strict";

  /**
   *
   */
  var TaskList = function ( file ) {
    this.reset();
    file && this.load && this.load( file );
    return this;
  }

  /**
   *
   */
  TaskList.prototype.reset = function () {
    this.tasks = [];
    return this;
  }

  /**
   *
   */
  TaskList.prototype.addTask = function ( str ) {
    this.tasks.push( new Task( str ) );
    return this;
  }

  /**
   *
   */
  TaskList.prototype.load = function ( file ) {
    this.reset();

    var self = this
      , content = fs.readFileSync ( file, 'utf8' )
      , i = 0
      ;
    
    content && (content = content.split ( /\r?\n/ ));
    content.forEach ( function ( line ) {
      line = line.trim();
      line.length && self.addTask ( line );
      self.tasks.slice(-1)[0].id = ++i;
    });

    return this;
  }

  return TaskList;

}(this));

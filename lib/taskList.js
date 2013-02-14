/**
 *
 */

var Task = require('./Task')
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
  }

  /**
   *
   */
  TaskList.prototype.addTask = function ( str ) {
    this.tasks.push( new Task( str ) );
  }

  /**
   *
   */
  TaskList.prototype.load = function ( file ) {
    this.reset();

    var buf = ''
      , r;
    fs.createReadStream(file).setEncoding('utf8')
      .on('data', function ( data ) {
        buf += data;
        if ( (r = buf.split(/\r?\n/)).length > 1 ) {
          buf = r.pop();
          r.forEach( function( s ) { this.addTask( s ); } );
        }
      })
      .on('end', function () {
        if ( buf.length ) {
          this.addTask( buf );
        }
      });

    return this;
  }

  return TaskList;

}(this));

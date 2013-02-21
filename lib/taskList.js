/**
 *
 */

var Task = require ( './task' )
  , Project = require ( './project' )
  , Context = require ( './context' )
  , fs = require ( 'fs' )
  ;

exports = module.exports = (function () {
  "use strict";

  // filter builders
  var filterCompleted = function ( include ) {
    var f = function ( t ) {
      return include === t.isCompleted ();
    };
    f.type = 'complete';
    return f;
  };

  var filterProject = function ( project, include ) {
    var f = function ( t ) {
      if ( !t.projects ) { return !include; }
      var x = t.projects.indexOf ( project );
      return !!(include ? x >= 0 : x < 0);
    };
    f.type = 'project';
    return f;
  };

  var filterContext = function ( context, include ) {
    var f = function ( t ) {
      if ( !t.contexts ) { return !include; }
      var x = t.contexts.indexOf ( context );
      return include ? x >= 0 : x < 0;
    };
    f.type = 'context';
    return f;
  };

  /**
   *
   */
  var TaskList = function () {
    var self = this;
    this.reset();
    Array.prototype.slice.call ( arguments ).forEach ( function ( file ) {
      self.load ( file );
    });
    return this;
  };

  /**
   *
   */
  TaskList.prototype.reset = function () {
    this.tasks = [];
    this.projects = {};
    this.contexts = {};
    return this;
  };

  /**
   *
   */
  TaskList.prototype.addTask = function ( str ) {
    var t = new Task( str )
      , self = this
      ;
    this.tasks.push( t );

    // create projects / add tasks to corresponding projects
    if ( t.projects && t.projects.length ) {
      t.projects.forEach ( function ( p ) {
        var proj = self.projects [ p ];
        if ( ! proj ) {
          proj = new Project ( p );
          self.projects [ p ] = proj;
        }
        proj.addTask ( t );
      });
    }

    // create contexts / add tasks to corresponding contexts
    if ( t.contexts && t.contexts.length ) {
      t.contexts.forEach ( function ( c ) {
        var ctx = self.contexts [ c ];
        if ( ! ctx ) {
          ctx = new Context ( c );
          self.contexts [ c ] = ctx;
        }
        ctx.addTask ( t );
      });
    }

    return this;
  };

  /**
   *
   */
  TaskList.prototype.load = function ( file ) {
    var self = this
      , content = fs.readFileSync ( file, 'utf8' )
      , i = 0
      ;

    content && (content = content.split ( /\r?\n/ ));
    content.forEach ( function ( line ) {
      line = line.trim();
      line.length && self.addTask ( line );
    });

    return this;
  };

  /**
   *
   */
  TaskList.prototype.list = function () {
    var tasks = this.tasks.slice ()
      , include = []
      , exclude = []
      ;
    
    // convert each argument into a filter
    Array.prototype.slice.call ( arguments ).forEach ( function ( arg ) {
      var inc = arg [ 0 ] !== '-'
        , filter
        ;
      
      [ '+', '-' ].indexOf ( arg [ 0 ] ) >= 0 && (arg = arg.slice ( 1 ) );

      if ( 'complete' === arg ) { filter = filterCompleted ( inc ); }
      else if ( '@' === arg [ 0 ] ) { filter = filterContext ( arg.slice ( 1 ), inc ); }
      else { filter = filterProject ( arg, inc ); }

      (inc ? include : exclude).push ( filter );
    });
    
    // apply filters, exclusion first
    exclude.forEach ( function ( filter ) {
      tasks = tasks.filter ( filter );
    });
    include.forEach ( function ( filter ) {
      tasks = tasks.filter ( filter ) ;
    });
    // now make sure each tasks fit at least one inclusion filter
    // tasks = tasks.filter ( function ( task ) {
    //   return include.some ( function ( filter ) { return filter ( task ); });
    // });

    return tasks;
  };

  return TaskList;

}(this));

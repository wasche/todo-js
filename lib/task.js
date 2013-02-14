/**
 *
 */

exports = module.exports = (function (){
  "use strict";
  
  // regular expressions
  var DateFormat      = /(\d{4}\-[0-1]\d\-[0-3]\d)/
    , CompletedFormat = new RegExp('x ' + DateFormat.source)
    , PriorityFormat  = /\(([A-Z])\)/
    , ContextFormat   = /(@[^\s]*[\w_])/g
    , ProjectFormat   = /(\+[^\s]*[\w_])/g
    , MetaFormat      = /([^\s:][\w_]*:[^\s]+[\w_]?)/g
    , TaskFormat      = new RegExp('^(' + CompletedFormat.source + '\\s|' + PriorityFormat.source + '\\s)?(' + DateFormat.source + '\\s)?(.+)')
    ;

  var formatDate = function( date ) {
    var m = date.getMonth() + 1;
    var d = date.getDate();
    m >= 10 || (m = '0' + m);
    d >= 10 || (d = '0' + d);
    return [date.getFullYear(), m, d].join('-');
  }

  var parseDate = function( str ) {
    var d = str.split ( '-' ).map ( function ( s ) { return parseInt ( s ); } );
    d[1] -= 1;
    return new Date ( d[0], d[1], d[2] );
  }

  /**
   *
   */
  var Task = function (str){
    this.reset ();
    undefined !== str && this.parse( str );
    return this;
  }

  /**
   *
   */
  Task.prototype.reset = function () {
    this.id = null;
    this.source = null;
    this.text = null;
    this.priority = null;
    this.createdAt = null;
    this.completedAt = null;
    this.contexts = null;
    this.projects = null;
    this.metadata = null;

    return this;
  }

  /**
   *
   */
  Task.prototype.parse = function (str) {
    this.reset ();
    str = str.trim();
    if ( ! str.length ) { return this; }
    if ( ! TaskFormat.test(str) ) { return this; }

    this.source = str;

    RegExp.$2 && (this.completedAt = RegExp.$2);
    RegExp.$3 && (this.priority = RegExp.$3);
    RegExp.$4 && (this.createdAt = RegExp.$4);
    this.text = RegExp.$6.trim();

    // parse the dates, if any
    this.completedAt && (this.completedAt = parseDate ( this.completedAt ));
    this.createdAt && (this.createdAt = parseDate ( this.createdAt ));

    var m;
    this.contexts = (m = this.text.match( ContextFormat )) && m.map( function (v) { return v.substring(1); });
    this.projects = (m = this.text.match( ProjectFormat )) && m.map( function (v) { return v.substring(1); });
    this.metadata = (m = this.text.match( MetaFormat )) && m.reduce( function (m, v) {
      var s = v.split(/:/);
      m[s[0]] = s[1];
      return m;
    }, {} );

    return this;
  }

  /**
   *
   */
  Task.prototype.complete = function () {
    this.completedAt = new Date();
    return this;
  }

  /**
   *
   */
  Task.prototype.isCompleted = function () {
    return !! this.completedAt;
  }

  /**
   *
   */
  Task.prototype.append = function ( str ) {
    this.text += ' ' + str;
    return this;
  }

  /**
   *
   */
  Task.prototype.prepend = function ( str ) {
    this.text = str + ' ' + this.text;
    return this;
  }

  /**
   *
   */
  Task.prototype.prioritize = function ( priority ) {
    this.priority = priority;
    return this;
  }

  /**
   *
   */
  Task.prototype.deprioritize = function () {
    this.priority = null;
    return this;
  }

  /**
   *
   */
  Task.prototype.toString = function (withId) {
    return (withId ? (this.id < 10 ? '0' : '') + this.id + ' ' : '') +
      (this.completedAt ? 'x ' + formatDate( this.completedAt ) + ' ' : '') +
      (this.priority ? '(' + this.priority + ') ' : '') +
      (this.createdAt ? formatDate( this.createdAt ) + ' ' : '' ) +
      this.text;
  }

  return Task;

}( this ));

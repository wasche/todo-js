var should = require ( 'should' )
  , Task = require ( '../lib/Task' )
  ;

describe ( 'Task', function () {
  var task;

  it ( 'should accept a string in the constructor', function () {
    task = new Task('foo');
    should.exist ( task.text );
  });

  describe ( '#parse', function () {

    beforeEach ( function () {
      task = new Task ();
    });

    it ( 'with description only', function () {
      task.parse ( 'description only' );
      should.exist ( task.text );
      task.text.should.equal ( 'description only' );

    });

    it ( 'with 2012-01-01 created', function () {
      task.parse ( '2012-01-01 created' );
      should.exist ( task.text );
      should.exist ( task.createdAt );
      task.text.should.equal ( 'created' );
      task.createdAt.should.equal ( new Date ( 2012, 0, 1 ) );
    });

    it ( 'with x 2012-01-01 completed', function () {
      task.parse ( 'x 2012-01-01 completed' );
      should.exist ( task.text );
      should.exist ( task.completedAt );
      task.isCompleted().should.be.true;
      task.text.should.equal ( 'completed' );
      task.completedAt.should.equal ( new Date ( 2012, 0, 1) );
    });

    it ( 'with (A) priority', function () {
      task.parse ( '(A) priority' );
      should.exist ( task.text );
      should.exist ( task.priority );
      task.text.should.equal ( 'priority' );
      task.priority.should.equal ( 'A' );
    });

    it ( 'with (A) 2012-01-01 priority and date', function () {
      task.parse ( '(A) 2012-01-01 priority and date' );
      should.exist ( task.text );
      should.exist ( task.priority );
      should.exist ( task.createdAt );
      task.text.should.equal ( 'priority and date' );
      task.priority.should.equal ( 'A' );
      task.createdAt.should.equal ( new Date ( 2012, 0, 1 ) );
    });

    it ( 'with x 2012-01-01 2012-01-01 created and completed', function () {
      task.parse ( 'x 2012-01-01 2012-01-01 created and completed' );
      should.exist ( task.text );
      should.exist ( task.createdAt );
      should.exist ( task.completedAt );
      task.text.should.equal ( 'created and completed' );
      task.createdAt.should.equal ( new Date ( 2012, 0, 1 ) );
      task.completedAt.should.equal ( new Date ( 2012, 0, 1) );
    });

    it ( 'with @c contexts', function () {
      task.parse ( '@c contexts' );
      should.exist ( task.text );
      should.exist ( task.contexts );
      task.text.should.equal ( '@c contexts' );
      task.contexts.length.should.equal ( 1 );
      task.contexts[0].should.equal ( 'c' );
    });

    it ( 'with +p projects', function () {
      task.parse ( '+p projects');
      should.exist ( task.text );
      should.exist ( task.projects );
      task.text.should.equal ( '+p projects' );
      task.projects.length.should.equal ( 1 );
      task.projects[0].should.equal ( 'p' );
    });

    it ( 'with a:b metadata', function () {
      task.parse ( 'a:b metadata' );
      should.exist ( task.text );
      should.exist ( task.metadata );
      should.exist ( task.metadata.a );
      task.text.should.equal ( 'a:b metadata' );
      task.metadata.a.should.equal ( 'b' );
    });

  });

  describe ( '#reset', function () {
    it ( 'should clear all fields', function () {
      task = new Task('x 2012-01-01 2012-01-01 desc @c +p m:foo');
      should.exist ( task.text );
      should.exist ( task.createdAt );
      should.exist ( task.completedAt );
      should.exist ( task.projects );
      should.exist ( task.contexts );
      should.exist ( task.metadata );
      task.priority = 'a';
      task.reset();
      should.not.exist ( task.text );
      should.not.exist ( task.createdAt );
      should.not.exist ( task.completedAt );
      should.not.exist ( task.projects );
      should.not.exist ( task.contexts );
      should.not.exist ( task.metadata );
      should.not.exist ( task.priority );
    });
  });

  describe ( '#complete', function () {
    it ( 'should mark task as completed and set the date to today', function () {
      task = new Task();
      task.isCompleted().should.be.false;
      task.complete();
      task.isCompleted().should.be.true;
    });
  });

  describe ( '#prioritize', function () {
    it ( 'should set priority', function () {
      task = new Task();
      should.not.exist ( task.priority );
      task.prioritize ( 'A' );
      should.exist ( task.priority );
    });
  });

  describe ( '#deprioritize', function () {
    it ( 'should remove priority', function () {
      task = new Task( '(A) description' );
      should.exist ( task.priority );
      task.deprioritize();
      should.not.exist ( task.priority );
    });
  });

  describe ( '#append', function () {
    it ( 'should append to task text', function () {
      task = new Task( 'foo' );
      task.text.should.equal ( 'foo' );
      task.append ( 'bar' );
      task.text.should.equal ( 'foo bar' );
    });
  });

  describe ( '#prepend', function () {
    it ( 'should prepend to task text', function () {
      task = new Task( 'foo' );
      task.text.should.equal ( 'foo' );
      task.prepend ( 'a' );
      task.text.should.equal ( 'a foo' );
    });
  });

  describe ( '#toString', function () {
    it ( 'should return original string when not using id', function () {
      var str = 'x 2012-01-01 2012-01-01 @c +p a:b foo';
      task = new Task( str );
      task.toString().should.equal ( str );
    });

    it ( 'should prepend id to original string when using id', function () {
      var str = 'x 2012-01-01 2012-01-01 @c +p a:b foo';
      task = new Task( str );
      task.id = 1;
      task.toString( true ).should.equal ( '01 ' + str );
    });
  });

});
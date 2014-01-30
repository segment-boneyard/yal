
var assert = require('assert');
var Logger = require('..');
var axon = require('axon');
var os = require('os');

describe('Logger#send(level, type, msg)', function(){
  it('should send a message', function(done){
    var sock = axon.socket('pull');
    sock.format('json');
    sock.bind('tcp://localhost:5555');

    sock.on('message', function(_){
      assert(_.timestamp);
      assert(_.hostname == os.hostname());
      assert('info' == _.level);
      assert('something' == _.type);
      assert('bar' == _.message.foo);
      done();
    });

    var log = new Logger('tcp://localhost:5555');
    log.send('info', 'something', { foo: 'bar' });
  })
})

;['debug', 'info', 'warn', 'error', 'critical', 'alert', 'emergency'].forEach(function(level){
  describe('Logger#' + level + '(msg)', function(){
    it('should send a message', function(done){
      var sock = axon.socket('pull');
      sock.format('json');

      sock.bind(0, function(){
        var addr = sock.address().string;

        sock.on('message', function(_){
          assert(_.timestamp);
          assert(level == _.level);
          assert('something' == _.type);
          assert('bar' == _.message.foo);
          done();
        });

        var log = new Logger([addr]);
        log[level]('something', { foo: 'bar' });
      });
    })
  })
})
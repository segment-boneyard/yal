
var Logger = require('./');
var axon = require('axon');

var a = axon.socket('pull');
a.format('json');
a.bind('tcp://localhost:5000');

a.on('message', function(_){
  // console.log('A: %j', _.message);
});

var b = axon.socket('pull');
b.format('json');
b.bind('tcp://localhost:5001');

b.on('message', function(_){
  // console.log('B: %j', _.message);
});

var log = new Logger([
  'tcp://localhost:5000',
  'tcp://localhost:5001'
]);

setInterval(function(){
  log.info('viewed page', { user: 'tobi' });
}, 300);

setInterval(function(){
  log.info('signed in', { user: 'jane' });
}, 1000);

setInterval(function(){
  log.error('oh no boom', { something: 'here' });
}, 3000);
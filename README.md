
# YAL

  Yet-Another-Logger that pushes logs to log servers with axon/tcp to delegate network overhead. The log server implementation then fans out
  to remote services, elastic search, or whatever you like.

  I've found that while fanout tools like Winston help with logging to
  multiple services, you should not use it directly in your application(s),
  this is especially true as many logging services are enabled __only__ in
  production, and thus may not be tested properly locally or in staging
  environment. Delegating this responsibility to log servers that are
  not mission critical is a simple solution.

## Installation

```
$ npm install yal
```

## About

 - when __NODE_ENV__ is "development" the log level defaults to "debug"
 - when __NODE_ENV__ is not "development" the log level defaults to "info"
 - when __NODE_ENV__ is "test" the logger will not write to stdio
 - the log level may be altered via the __LOG_LEVEL__ environment variable
 - 5 levels are supported: debug, info, warn, error, & fatal
 - you may distribute messages to one or more axon log servers

## Example

  The following example shows two servers,
  with the logger doing round-robin requests
  between the two.

```js
var Logger = require('yal');
var axon = require('axon');

var a = axon.socket('pull');
a.format('json');
a.bind('tcp://localhost:5000');

a.on('message', function(_){
  console.log('A: %j', _.message);
});

var b = axon.socket('pull');
b.format('json');
b.bind('tcp://localhost:5001');

b.on('message', function(_){
  console.log('B: %j', _.message);
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
```

## API

### Logger(addresses)

  Pass a string or array of addresses.

### .LEVEL(type, msg)

  Send a log message.

## License

 MIT

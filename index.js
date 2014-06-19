
/**
 * Module dependencies.
 */

var stringify = require('json-stringify-safe');
var debug = require('debug')('logger');
var assert = require('assert');
var axon = require('axon');
var os = require('os');
var host = os.hostname();

/**
 * Log level env var.
 */

var env = process.env.NODE_ENV || 'dev';
var test = 'test' == env;
var filter = process.env.LOG_LEVEL;

// filter defaults

filter = 'dev' == env
  ? (filter || 'debug')
  : (filter || 'info');

/**
 * Expose `Logger`.
 */

exports = module.exports = Logger;

/**
 * Log levels.
 */

var levels = exports.levels = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  critical: 4,
  alert: 5,
  emergency: 6
};

/**
 * Initialize a logger with the given `addrs`.
 *
 * @param {Array|String} addrs
 * @api public
 */

function Logger(addrs) {
  if ('string' == typeof addrs) addrs = [addrs];
  this.filter = levels[filter];
  assert(addrs, 'log-server addresses required');
  this.stdio = true;
  this.sock = axon.socket('push');
  this.sock.format('json');
  this.connect(addrs);
}

/**
 * Connect to `addrs`.
 *
 * @param {Array} addrs
 * @api private
 */

Logger.prototype.connect = function(addrs){
  debug('connect to %j', addrs);
  var sock = this.sock;
  addrs.forEach(function(addr){
    sock.connect(addr);
  });
}

/**
 * Disable stdio.
 *
 * @return {Logger}
 * @api public
 */

Logger.prototype.silent = function(){
  this.stdio = false;
  return this;
};

/**
 * Send log `msg` of `type` at `level`.
 *
 * @param {String} level
 * @param {String} type
 * @param {Object} msg
 * @api public
 */

Logger.prototype.send = function(level, type, msg){
  // filter
  var n = levels[level];
  if (n < this.filter) return;

  // default msg
  if (null == msg) msg = {};

  // expose error messages
  if (msg instanceof Error) msg = clone(msg);
  if (msg.error instanceof Error) msg.error = clone(msg.error);

  // timestamp
  var now = new Date;

  // stdio
  if (this.stdio && !test) {
    var meth = n > levels.info ? 'error' : 'log';
    if ('dev' == env) {
      console[meth]('%s - %s - %s', level, type, stringify(msg, null, 2));
    } else {
      console[meth]('%s (%s) - %s - %s', now.toUTCString(), level, type, stringify(msg, null, 2));
    }
  }

  // send
  this.sock.send({
    timestamp: +now,
    hostname: host,
    message: msg,
    level: level,
    type: type
  });
};

/**
 * Log levels.
 */

Object.keys(levels).forEach(function(level){
  Logger.prototype[level] = function(type, msg){
    this.send(level, type, msg);
  };
});

/**
 * Clone `err` with enumerable `.message`.
 *
 * @param {Error} err
 * @return {Object}
 * @api private
 */

function clone(err){
  var ret = {
    message: err.message,
    stack: err.stack
  };

  for (var key in err) {
    ret[key] = err[key];
  }

  return ret;
}

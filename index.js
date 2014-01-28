
/**
 * Module dependencies.
 */

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
  fatal: 4
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

  // stdio
  var now = new Date

  if (!test) {
    var meth = n > levels.info ? 'error' : 'log';
    if ('dev' == env) {
      console[meth]('%s - %s - %j', level, type, msg);
    } else {
      console[meth]('%s (%s) - %s - %j', now.toUTCString(), level, type, msg);
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

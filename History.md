
1.3.4 / 2016-12-06
==================

  * Merge pull request #18 from segmentio/indent
  * Add option to indent json output.

1.3.3 / 2016-01-25
==================

  * Merge pull request #17 from segmentio/limits
  * Add .hwm option


1.3.2 / 2014-06-19
==================

 * add json-stringify-safe for stdout json

1.3.1 / 2014-06-17
==================

 * json.stringify() the message in console output so you can actually read it.
   we should probably make this optional later, greppable output is nice as well

1.3.0 / 2014-04-17
==================

 * add silent() to disable stdio

1.2.4 / 2014-03-10
==================

 * fix msg.error (thanks julian!)

1.2.3 / 2014-03-08
==================

 * add .error support. Closes #5

1.2.2 / 2014-02-18
==================

 * add .stack to error properties

1.2.1 / 2014-01-30
==================

 * remove .fatal

1.2.0 / 2014-01-30
==================

 * add other syslog levels

1.1.2 / 2014-01-29
==================

 * add msg default of {}

1.1.1 / 2014-01-28
==================

 * fix clobbering of type var. Closes #2

1.1.0 / 2014-01-20
==================

 * add: expose .levels

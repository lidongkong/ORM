'use strict';

(function() {
  var env;

  if (process.env.KW_ENV) {
    env = process.env.KW_ENV;
  } else {
    env = 'dev';
  }
  
console.log('env KW_ENV ', env); 
  
  if (!( env === 'test'
    || env === 'dev'
	|| env === 'devORM'
    || env === 'production')) {
    throw new Error('"' + env + '" is not an allowed environment');
  }

  module.exports = env;
})();
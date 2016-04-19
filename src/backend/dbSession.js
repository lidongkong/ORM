'use strict';

var env = require('./env');
var dbOptions = require('../../database.json')[env];
var DBWrapper = require('node-dbi').DBWrapper;

var dbWrapper;
if (dbOptions.driver === 'sqlite3') {
  var dbWrapper = new DBWrapper('sqlite3', {'path': dbOptions.filename});
} else if (dbOptions.driver === 'mysql') {
  dbWrapper = new DBWrapper('mysql', {
    'host': dbOptions.host,
    'user': dbOptions.user,
    'password': dbOptions.password,
    'database': dbOptions.database
  });
} else if (dbOptions.driver === 'devORM') {
	
	var Connection = require('tedious').Connection;
	var config = {
		userName: dbOptions.user,
		password: dbOptions.password,
		server: dbOptions.host,
		driver: dbOptions.driver,
		database: dbOptions,
		options: {
			instanceName: dbOptions.instance
		}
	};
	
	
	

} else {
  throw(new Error('No suitable database config found.'));
}

dbWrapper.connect();
module.exports = dbWrapper;
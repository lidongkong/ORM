'use strict';

var querying = require('../../src/backend/sql/query.js').querying;

var rn = querying("SELECT * FROM [ACM_ORM].[TestManual].[Departments];", function (err, data)
	{
		console.log('test', data);
	}


);


console.log('Server started and listening on port', rn);


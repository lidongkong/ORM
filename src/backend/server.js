'use strict';

var Percolator = require('percolator').Percolator;
//var dbSession = require('../../src/backend/dbSession.js');
var querying = require('../../src/backend/sql/query.js').querying;
var validateUser = require('../../src/backend/lib/RequestUser.js').ValidateUser;
var logout = require('../../src/backend/lib/session.js').logout;

var Server = function(port) {
  var server = Percolator({'port': port, 'autoLink': false, 'staticDir': __dirname + '/../frontend'});

  
  server.route('/api/account',
    {
      POST: function (req, res) {
		  
        req.onJson(function(err, userToken) {
          if (err) {
            console.log(err);
            res.status.internalServerError(err);
          } else {
			  
            validateUser(userToken, function (result) {

				console.log(result);
                //res.object({'status': 'ok', 'id': newDept.categoryID}).send();
				//res.object({'status': 'ok', 'id': result.insertId}).send();
				
				
				if (result.ValidToken){
					res.setHeader('set-cookie', 'user=' + result.Username + ';expires=Wed, 08-Nov-2017 14:52:08 GMT;path=/;');
				}
								
				res.collection(result).send();

            });
			
          }
        });
      }
    }
  );
  
  server.route('/api/logout',
    {
      GET: function (req, res) {
		  
			//var myDate = new Date('2000-01-01').toISOString();
			//var cookieString = 'expires=' + myDate + ';path=/;';
			//console.log('date :' + cookieString);
			//res.setHeader('set-Cookie', cookieString);
			//res.removeHeader('set-Cookie');
			//res.removeHeader('set-cookie');
			
            res.statusCode = 302;
			res.setHeader("Location", '../#/account');
			res.end();

      }
    }
  );
  
  server.route('/api/departments',
    {
      GET: function (req, res) {
		  	  
		// display returned cookies in header
		//console.log(req.headers.cookie);
		//res.setHeader('set-Cookie', req.headers.cookie);
		
	    console.log(req.headers.cookie);
	  
	    var cookie = req.headers.cookie;
	  
	    if (!logout(res, cookie)){
		  
			var rn = querying("SELECT [DepartmentID],[Name] FROM [ACM_ORM].[TestManual].[Departments] ORDER BY [Name];", function (err, data){
			  if (err) {
				console.log(err);
				res.status.internalServerError(err);
			  } else {
				  //res.object({'foo': data}).send();
				  res.collection(data).send();
			  }

			});
		}
      },

      POST: function (req, res) {
		  
		  console.log('past insert');
		  
        req.onJson(function(err, newDept) {
          if (err) {
            console.log(err);
            res.status.internalServerError(err);
          } else {
            querying("INSERT INTO [ACM_ORM].[TestManual].[Departments] (name) VALUES ('" + newDept.value + "');", function (err, result) {
              if (err) {
                console.log(err);
                res.status.internalServerError(err);
              } else {
                res.object({'status': 'ok', 'id': newDept.categoryID}).send();
				//res.object({'status': 'ok', 'id': result.insertId}).send();
              }
            });
          }
        });
      }
    }
  );
  
  server.route('/api/departments/:id',
    {
      POST: function(req, res) {

        var departmentId = req.uri.child();
		
        req.onJson(function(err, dept) {
			console.log('past update' + departmentId + dept.value);
			
          if (err) {
            console.log(err);
            res.status.internalServerError(err);
          } else {
			querying("UPDATE [ACM_ORM].[TestManual].[Departments] SET name ='" + dept.value + "' WHERE departmentId =" + departmentId + ";",function (err, result) {
			//querying("UPDATE [ACM_ORM].[TestManual].[Departments] SET name ='www 33' WHERE departmentId =10;", function (err, result) {
              if (err) {
                console.log(err);
                res.status.internalServerError(err);
              } else {
                res.object({'status': 'ok'}).send();
              }
            });
          }
        });
      },

      DELETE: function(req, res) {
        var departmentId = req.uri.child();		
		
        querying("DELETE FROM [ACM_ORM].[TestManual].[Departments] WHERE departmentId = " + departmentId + ";", function(err, result) {
          if (err) {
            console.log(err);
            res.status.internalServerError(err);
          } else {
            res.object({'status': 'ok'}).send();
          }
        });
      }
    }
  );
  
  server.route('/api/containers',
    {
      GET: function (req, res) {
		  
        var rn = querying("SELECT [ContainerID] ,[Name] FROM [ACM_ORM].[TestManual].[containers] ORDER BY [Name] ;", function (err, data){
		  if (err) {
            console.log(err);
            res.status.internalServerError(err);
          } else {
			  //res.object({'foo': data}).send();
              res.collection(data).send();
          }

		});
      },

      POST: function (req, res) {
		  
		  console.log('past insert');
		  
        req.onJson(function(err, newDept) {
          if (err) {
            console.log(err);
            res.status.internalServerError(err);
          } else {
            querying("INSERT INTO [ACM_ORM].[TestManual].[containers] (name) VALUES ('" + newDept.value + "');", function (err, result) {
              if (err) {
                console.log(err);
                res.status.internalServerError(err);
              } else {
                res.object({'status': 'ok', 'id': '-100'}).send();
				//res.object({'status': 'ok', 'id': result.insertId}).send();
              }
            });
          }
        });
      }
    }
  );
  
  server.route('/api/containers/:id',
    {
      POST: function(req, res) {

        var containerId = req.uri.child();
		
        req.onJson(function(err, dept) {
			console.log('past update' + containerId + dept.value);
			
          if (err) {
            console.log(err);
            res.status.internalServerError(err);
          } else {
			querying("UPDATE [ACM_ORM].[TestManual].[containers] SET name ='" + dept.value + "' WHERE containerId =" + containerId + ";",function (err, result) {
              if (err) {
                console.log(err);
                res.status.internalServerError(err);
              } else {
                res.object({'status': 'ok'}).send();
              }
            });
          }
        });
      },

      DELETE: function(req, res) {
        var containerId = req.uri.child();		
		
        querying("DELETE FROM [ACM_ORM].[TestManual].[containers] WHERE containerId = " + containerId + ";", function(err, result) {
          if (err) {
            console.log(err);
            res.status.internalServerError(err);
          } else {
            res.object({'status': 'ok'}).send();
          }
        });
      }
    }
  );
  
  server.route('/api/pictures',
    {
      GET: function (req, res) {
		  	  
		// display returned cookies in header
		//console.log(req.headers.cookie);
		//res.setHeader('set-Cookie', req.headers.cookie);
		
	  
		  
        var rn = querying("SELECT [PictureID],[Name] ,[ImageName] FROM [ACM_ORM].[TestManual].[pictures] ORDER BY [Name];", function (err, data){
		  if (err) {
            console.log(err);
            res.status.internalServerError(err);
          } else {
			  //res.object({'foo': data}).send();
              res.collection(data).send();
          }

		});
      },

      POST: function (req, res) {
		  		  
        req.onJson(function(err, newDept) {
		  console.log('past insert' + JSON.stringify(newDept));
			
          if (err) {
            console.log(err);
            res.status.internalServerError(err);
          } else {
            querying("INSERT INTO [ACM_ORM].[TestManual].[pictures] (name, imageName) VALUES ('" + newDept.value + "','" + newDept.image + "' );", function (err, result) {
              if (err) {
                console.log(err);
                res.status.internalServerError(err);
              } else {
                res.object({'status': 'ok', 'id': newDept.categoryID}).send();
				//res.object({'status': 'ok', 'id': result.insertId}).send();
              }
            });
          }
        });
      }
    }
  );
  
  server.route('/api/pictures/:id',
    {
      POST: function(req, res) {

        
		
        req.onJson(function(err, dept) {
		  var pictureId = dept[0];

          if (err) {
            console.log(err);
            res.status.internalServerError(err);
          } else {
			querying("UPDATE [ACM_ORM].[TestManual].[pictures] SET name ='" + dept[1] + "', imagename ='" + dept[2] + "' WHERE pictureId =" + pictureId + ";",function (err, result) {
			//querying("UPDATE [ACM_ORM].[TestManual].[Departments] SET name ='www 33' WHERE pictureId =10;", function (err, result) {
              if (err) {
                console.log(err);
                res.status.internalServerError(err);
              } else {
                res.object({'status': 'ok'}).send();
              }
            });
          }
        });
      },

      DELETE: function(req, res) {
        var pictureId = req.uri.child();		
		
        querying("DELETE FROM [ACM_ORM].[TestManual].[pictures] WHERE pictureId = " + pictureId + ";", function(err, result) {
          if (err) {
            console.log(err);
            res.status.internalServerError(err);
          } else {
            res.object({'status': 'ok'}).send();
          }
        });
      }
    }
  );

  server.route('/api/specimen',
    {
      GET: function (req, res) {
		  
		//console.log(req.headers.cookie);
		//res.setHeader('set-Cookie', req.headers.cookie);
		  
        var rn = querying("SELECT [SpecimenID] ,[Name] FROM [ACM_ORM].[TestManual].[SpecimenTypes] ORDER BY [Name];", function (err, data){
		  if (err) {
            console.log(err);
            res.status.internalServerError(err);
          } else {
			  //res.object({'foo': data}).send();
              res.collection(data).send();
          }

		});
      },

      POST: function (req, res) {
		  
		  console.log('past insert');
		  
        req.onJson(function(err, newDept) {
          if (err) {
            console.log(err);
            res.status.internalServerError(err);
          } else {
            querying("INSERT INTO [ACM_ORM].[TestManual].[SpecimenTypes] (name) VALUES ('" + newDept.value + "');", function (err, result) {
              if (err) {
                console.log(err);
                res.status.internalServerError(err);
              } else {
                res.object({'status': 'ok', 'id': '-100'}).send();
				//res.object({'status': 'ok', 'id': result.insertId}).send();
              }
            });
          }
        });
      }
    }
  );
  
  server.route('/api/specialty',
    {
      GET: function (req, res) {
		  
		//console.log(req.headers.cookie);
		//res.setHeader('set-Cookie', req.headers.cookie);
		  
        var rn = querying("SELECT [SpecialtyID] ,[Name] FROM [ACM_ORM].[TestManual].[Specialties] ORDER BY [Name];", function (err, data){
		  if (err) {
            console.log(err);
            res.status.internalServerError(err);
          } else {
			  //res.object({'foo': data}).send();
              res.collection(data).send();
          }

		});
      }
    }
  );
  
  server.route('/api/specialty/:id',
    {
	  GET: function (req, res) {
		  
		//console.log(req.headers.cookie);
		//res.setHeader('set-Cookie', req.headers.cookie);
		var testId = req.uri.child();
		  
        var rn = querying("SELECT s.SpecialtyID, s.Name FROM [ACM_ORM].[TestManual].[TestSpecialties] ts LEFT JOIN [ACM_ORM].[TestManual].[Specialties] s on ts.SpecialtyID = s.SpecialtyID WHERE LISTestID =" + testId + ";", function (err, data){
		  if (err) {
            console.log(err);
            res.status.internalServerError(err);
          } else {
			  //res.object({'foo': data}).send();
              res.collection(data).send();
          }

		});
      }
    }
  );
  
  server.route('/api/panel/:id',
    {
	  GET: function (req, res) {
		  
		//console.log(req.headers.cookie);
		//res.setHeader('set-Cookie', req.headers.cookie);
		var testId = req.uri.child();
		  
        var rn = querying("SELECT pt.PanelLISTestID, t.LISName + '  ' +  convert(char(10),t.BarcodeID)  + '  ' + t.Mnemonic dd FROM [ACM_ORM].[TestManual].[PanelTests] pt LEFT JOIN [ACM_ORM].[TestManual].[LISTests] t on pt.PanelLISTestID = t.LISTestID WHERE pt.LISTestID = " + testId + ";", function (err, data){
		  if (err) {
            console.log(err);
            res.status.internalServerError(err);
          } else {
			  //res.object({'foo': data}).send();
              res.collection(data).send();
          }

		});
      },
    }
  );
  
  server.route('/api/specimen/:id',
    {
	  GET: function (req, res) {
		  
		//console.log(req.headers.cookie);
		//res.setHeader('set-Cookie', req.headers.cookie);
		var testId = req.uri.child();
		  
        var rn = querying("SELECT s.SpecimenID, s.Name FROM [ACM_ORM].[TestManual].[TestSpecimens] ts LEFT JOIN [ACM_ORM].[TestManual].[SpecimenTypes] s on ts.SpecimenID = s.SpecimenID WHERE LISTestID =" + testId + ";", function (err, data){
		  if (err) {
            console.log(err);
            res.status.internalServerError(err);
          } else {
			  //res.object({'foo': data}).send();
              res.collection(data).send();
          }

		});
      },
	  
      POST: function(req, res) {

        var specimenId = req.uri.child();
		
        req.onJson(function(err, dept) {
			console.log('past update' + specimenId + dept.value);
			
          if (err) {
            console.log(err);
            res.status.internalServerError(err);
          } else {
			querying("UPDATE [ACM_ORM].[TestManual].[SpecimenTypes] SET name ='" + dept.value + "' WHERE specimenId =" + specimenId + ";",function (err, result) {
              if (err) {
                console.log(err);
                res.status.internalServerError(err);
              } else {
                res.object({'status': 'ok'}).send();
              }
            });
          }
        });
      },

      DELETE: function(req, res) {
        var specimenId = req.uri.child();		
		
        querying("DELETE FROM [ACM_ORM].[TestManual].[SpecimenTypes] WHERE specimenId = " + specimenId + ";", function(err, result) {
          if (err) {
            console.log(err);
            res.status.internalServerError(err);
          } else {
            res.object({'status': 'ok'}).send();
          }
        });
      }
    }
  );
  
  server.route('/api/misword',
    {
      GET: function (req, res) {
		  
		//console.log(req.headers.cookie);
		//res.setHeader('set-Cookie', req.headers.cookie);
		  
        var rn = querying("SELECT [MisspelledWord],[CorrectWord],[misspelledWordID] FROM [ACM_ORM].[TestManual].[MisspelledWords] ORDER BY [MisspelledWord];", function (err, data){
		  if (err) {
            console.log(err);
            res.status.internalServerError(err);
          } else {
			  //res.object({'foo': data}).send();
              res.collection(data).send();
          }

		});
      },

      POST: function (req, res) {
		  
		  console.log('past insert');
		  
        req.onJson(function(err, newDept) {
			console.log(newDept);
          if (err) {
            console.log(err);
            res.status.internalServerError(err);
          } else {
              querying("INSERT INTO [ACM_ORM].[TestManual].[MisspelledWords] (MisspelledWord, CorrectWord) VALUES ('" + newDept.mWord + "', '" + newDept.cWord + "');", function (err, result) {
              if (err) {
                console.log(err);
                res.status.internalServerError(err);
              } else {
                res.object({'status': 'ok', 'id': '-100'}).send();
				//res.object({'status': 'ok', 'id': result.insertId}).send();
              }
            });
          }
        });
      }
    }
  );
  
  server.route('/api/misword/:id',
    {
      POST: function(req, res) {

        req.onJson(function(err, dept) {
		  console.log('past update ' + dept[0] + dept[1]);
		  
		  var misspelledwordId = dept[2];
			
          if (err) {
            console.log(err);
            res.status.internalServerError(err);
          } else {
			querying("UPDATE [ACM_ORM].[TestManual].[MisspelledWords] SET MisspelledWord ='" + dept[0] + "', CorrectWord ='" + dept[1] + "' WHERE misspelledwordId =" + misspelledwordId + ";",function (err, result) {
              if (err) {
                console.log(err);
                res.status.internalServerError(err);
              } else {
                res.object({'status': 'ok'}).send();
              }
            });
          }
        });
      },

      DELETE: function(req, res) {
        var misspelledwordId = req.uri.child();;	
		
        querying("DELETE FROM [ACM_ORM].[TestManual].[MisspelledWords] WHERE misspelledwordId = " + misspelledwordId + ";", function(err, result) {
          if (err) {
            console.log(err);
            res.status.internalServerError(err);
          } else {
            res.object({'status': 'ok'}).send();
          }
        });
      }
    }
  );
  
  server.route('/api/keyword',
    {
      GET: function (req, res) {
		  
		//console.log(req.headers.cookie);
		//res.setHeader('set-Cookie', req.headers.cookie);
		  
        var rn = querying("SELECT [KeywordID],[Name] ,[IsEnabled] FROM [ACM_ORM].[TestManual].[Keywords] ORDER BY [Name];", function (err, data){
		  if (err) {
            console.log(err);
            res.status.internalServerError(err);
          } else {
			  //res.object({'foo': data}).send();
              res.collection(data).send();
          }

		});
      },

      POST: function (req, res) {
		  
		  console.log('past insert');
		  
        req.onJson(function(err, newDept) {
			console.log(newDept);
          if (err) {
            console.log(err);
            res.status.internalServerError(err);
          } else {
              querying("INSERT INTO [ACM_ORM].[TestManual].[Keywords] (name, IsEnabled) VALUES ('" + newDept.name + "', " + (+newDept.enabled) + ");", function (err, result) {
              if (err) {
                console.log(err);
                res.status.internalServerError(err);
              } else {
                res.object({'status': 'ok', 'id': '-100'}).send();
				//res.object({'status': 'ok', 'id': result.insertId}).send();
              }
            });
          }
        });
      }
    }
  );
  
  server.route('/api/keyword/:id',
    {
		GET: function (req, res) {
		  
		//console.log(req.headers.cookie);
		//res.setHeader('set-Cookie', req.headers.cookie);
		var testId = req.uri.child();
		  
        var rn = querying("SELECT w.[KeywordID], w.Name FROM [ACM_ORM].[TestManual].[TestKeywords] k LEFT JOIN [ACM_ORM].[TestManual].[Keywords] w on k.KeywordID = w.KeywordID WHERE LISTestID =" + testId + ";", function (err, data){
		  if (err) {
            console.log(err);
            res.status.internalServerError(err);
          } else {
			  //res.object({'foo': data}).send();
              res.collection(data).send();
          }

		});
      },
	  
      POST: function(req, res) {

        req.onJson(function(err, dept) {
		  console.log('past update ' + dept[0] + dept[1]);
		  
		  var keywordId = dept[0];
			
          if (err) {
            console.log(err);
            res.status.internalServerError(err);
          } else {
			querying("UPDATE [ACM_ORM].[TestManual].[keywords] SET name ='" + dept[1] + "', isenabled =" + (+dept[2]) + " WHERE keywordId =" + keywordId + ";",function (err, result) {
              if (err) {
                console.log(err);
                res.status.internalServerError(err);
              } else {
                res.object({'status': 'ok'}).send();
              }
            });
          }
        });
      },

      DELETE: function(req, res) {
        var keywordId = req.uri.child();
		//console.log(keywordId);
        querying("DELETE FROM [ACM_ORM].[TestManual].[keywords] WHERE keywordId = " + keywordId + ";", function(err, result) {
          if (err) {
            console.log(err);
            res.status.internalServerError(err);
          } else {
            res.object({'status': 'ok'}).send();
          }
        });
      }
    }
  );
  
  server.route('/api/contpict',
    {
      GET: function (req, res) {
		  
		//console.log(req.headers.cookie);
		//res.setHeader('set-Cookie', req.headers.cookie);
		  
        var rn = querying("SELECT [ContainerPictureID] [Id], [ContainerID], [PictureID] FROM [ACM_ORM].[TestManual].[ContainerPictures] ;", function (err, data){
		  if (err) {
            console.log(err);
            res.status.internalServerError(err);
          } else {
			  //res.object({'foo': data}).send();
              res.collection(data).send();
          }

		});
      },

      POST: function (req, res) {
		  
		  console.log('past insert');
		  
        req.onJson(function(err, newDept) {
			console.log(newDept);
          if (err) {
            console.log(err);
            res.status.internalServerError(err);
          } else {
              querying("INSERT INTO [ACM_ORM].[TestManual].[ContainerPictures] (ContainerID, PictureID) VALUES ('" + newDept.containerID + "', " + (+newDept.pictureID) + ");", function (err, result) {
              if (err) {
                console.log(err);
                res.status.internalServerError(err);
              } else {
                res.object({'status': 'ok', 'id': '-100'}).send();
				//res.object({'status': 'ok', 'id': result.insertId}).send();
              }
            });
          }
        });
      }
    }
  );
  
  server.route('/api/contpict/:id',
    {
      POST: function(req, res) {

        req.onJson(function(err, dept) {
		  console.log('past update ' + dept[0] + dept[1]);
		  
		  var ContainerPictureID = dept[0];
			
          if (err) {
            console.log(err);
            res.status.internalServerError(err);
          } else {
			querying("UPDATE [ACM_ORM].[TestManual].[ContainerPictures] SET ContainerID =" + dept[1] + ", PictureID =" + (+dept[2]) + " WHERE ContainerPictureID =" + ContainerPictureID + ";",function (err, result) {
              if (err) {
                console.log(err);
                res.status.internalServerError(err);
              } else {
                res.object({'status': 'ok'}).send();
              }
            });
          }
        });
      },

      DELETE: function(req, res) {
        var ContainerPictureID = req.uri.child();

        querying("DELETE FROM [ACM_ORM].[TestManual].[ContainerPictures] WHERE ContainerPictureID = " + ContainerPictureID + ";", function(err, result) {
          if (err) {
            console.log(err);
            res.status.internalServerError(err);
          } else {
            res.object({'status': 'ok'}).send();
          }
        });
      }
    }
  );
  
    server.route('/api/search',
    {

      POST: function (req, res) {
		  
		  //console.log('past POST: search');
		  
        req.onJson(function(err, search) {
			//console.log(search);
          if (err) {
            console.log(err);
            res.status.internalServerError(err);
          } else {
			  var sql = " WHERE ";
			  var and = " ";
			  
			  if (search.isPanel !== null && search.isPanel !== undefined && search.isPanel !== '') {
				  sql = sql + " IsPanel =" + (+search.isPanel);
				  and = " AND ";
			  }
			  //else {
			  //	sql = sql + " IsPanel = 0";
			  // }			  
			  
			  if (search.isInManual !== null && search.isInManual !== undefined && search.isPanel !== '') {
				  sql = sql + and + " IsInManual =" + (+search.isInManual);
				  and = " AND "
			  } 
			  //else {
			  //	sql = sql + and + " IsInManual = 0";
			  //}	
			  
			  if (search.testName !== null && search.testName !== undefined) {
				  sql = sql + and + "(TestName like '%" + search.testName + "%') ";
				  and = " AND "
			  }
			  
			  if (search.barcode !== null && search.barcode !== undefined) {
				  sql = sql + and + " (BarcodeID = " + search.barcode + ") ";
				  and = " AND "
			  }	
			  
			  if (search.mnemonic !== null && search.mnemonic !== undefined) {
				  sql = sql + and + " (Mnemonic like '%" + search.mnemonic + "%') ";
				  and = " AND "
			  }	
			  
			  if (search.deptId !== null && search.deptId !== undefined) {
				  sql = sql + and + " DepartmentID =" + search.deptId;
			  }			  
			  console.log(sql);
			  
              querying("SELECT TOP 300 [LISTestID],[TestName],[BarcodeID],[Mnemonic],[IsPanel],[IsInManual],[DepartmentID] FROM [TestManual].[LISTests] " + sql + " ORDER BY [TestName];", function (err, data) {
              if (err) {
                console.log(err);
                res.status.internalServerError(err);
              } else {
                res.collection(data).send();
              }
            });
          }
        });
      }
    }
  );
  
  server.route('/api/test',
    {
	  GET: function (req, res) {
		  
		//console.log(req.headers.cookie);
		//res.setHeader('set-Cookie', req.headers.cookie);
		  
        var rn = querying("SELECT LISTestID, LISName + '  ' +  convert(char(10),BarcodeID)  + '  ' + Mnemonic dd FROM [ACM_ORM].[TestManual].[LISTests] ORDER BY dd;", function (err, data){
		  if (err) {
            console.log(err);
            res.status.internalServerError(err);
          } else {
			  //res.object({'foo': data}).send();
              res.collection(data).send();
          }

		});
      },
	  
      POST: function (req, res) {
		  
		  console.log('past test POST');
		  
        req.onJson(function(err, newTest) {
			console.log(newTest);
          if (err) {
            console.log(err);
            res.status.internalServerError(err);
          } else {
			  var fields = "([IsPanel],[IsInManual]";
			  var values = "(";
			  
			  if (newTest.isPanel !== null && newTest.isPanel !== undefined) {
				  values = values + (+newTest.isPanel);
			  }
			  else {
					values = values + "0";
			  }			  
			  
			  if (newTest.isInManual !== null && newTest.isInManual !== undefined) {
				  values = values + "," + (+newTest.isInManual);
			  } 
			  else {
					values = values + ", 0";
			  }	
			  
			  if (newTest.TestName !== null && newTest.TestName !== undefined && newTest.TestName !== '') {
				  values = values + ", '" + newTest.TestName + "'";
				  fields = fields + ", " + "testName";
			  }
			  
			  if (newTest.BarcodeID !== null && newTest.BarcodeID !== undefined && newTest.BarcodeID !== '') {
				  values = values + ", " + newTest.BarcodeID;
				  fields = fields + ", " + "barcodeID";
			  }	
			  
			  if (newTest.Mnemonic !== null && newTest.Mnemonic !== undefined && newTest.Mnemonic !== '') {
				  values = values + ", '" + newTest.Mnemonic + "'";
				  fields = fields + ", " + "Mnemonic";
			  }	
			  
			  if (newTest.deptId !== null && newTest.deptId !== undefined && newTest.deptId !== '') {
				  values = values + ", " + newTest.deptId;
				  fields = fields + ", " + "DepartmentID";
			  }		

			  values = values + ")";		
				fields = fields + ")";			  
			  console.log(values);
			  console.log(fields);
			  
			  
              querying("INSERT INTO [ACM_ORM].[TestManual].[LISTests] " + fields + " VALUES " + values + ";", function (err, result) {
				  if (err) {
					console.log(err);
					res.status.internalServerError(err);
				  } else {
					res.object({'status': 'ok', 'id': '-100'}).send();
					//res.object({'status': 'ok', 'id': result.insertId}).send();
				  }
			  });
          }
        });
      }
    }
  );
  
  server.route('/api/test/:id',
    {
	    GET: function (req, res) {
		  
			//console.log(req.headers.cookie);
			var testId = req.uri.child();
			console.log('get in /api/test/:id  ' + testId );
			  
			querying("SELECT [LISTestID],[TestName],[BarcodeID],[Mnemonic],[IsReviewed],[LISName],[AlternateTestName],[ContainerID],[IsPanel],[IsInManual],[DepartmentID]" +
			",TransportTemperature,PreferredSpecimen,MinimumVolume, M, T, W, Th, F, S, Su, Reported,RTStability,RefridgeStablity, FrozenStability " + //14
			",[CollectionNotes],[AlsoAcceptable],[Methodology],[ReferenceRange], notes " +
			",CPT, LOINC, ExtraNotes " +
			" FROM [TestManual].[LISTests] where LISTestID = " + testId + ";", function (err, data) {
				if (err) {
					console.log(err);
					res.status.internalServerError(err);
				} else {
					  //res.object({'foo': data}).send();
					  //console.log(data[0]);
					  res.collection(data).send();
				}
			});

        },
	  
      POST: function(req, res) {

        req.onJson(function(err, updatedTest) {
		  console.log('past test ' + updatedTest[0] + updatedTest[1]);
		  
		  var LISTestID = updatedTest[0];
			
          if (err) {
            console.log(err);
            res.status.internalServerError(err);
          } else {
			  
			  //var fields = "([IsPanel],[IsInManual]";
			  var values = "";
			  
			  if (updatedTest[4] !== null && updatedTest[4] !== undefined) {
				  values = "IsPanel=" + (+updatedTest[4]);
			  }
			  else {
					values = "IsPanel=0";
			  }			  
			  
			  if (updatedTest[5] !== null && updatedTest[5] !== undefined) {
				  values = values + ", IsInManual=" + (+updatedTest[5]);
			  } 
			  else {
					values = values + ", IsInManual=0";
			  }	
			  
			  if (updatedTest[1] !== null && updatedTest[1] !== undefined) {
				  values = values + ", testName='" + updatedTest[1] + "'";
			  }
			  
			  if (updatedTest[2] !== null && updatedTest[2] !== undefined) {
				  values = values + ", barcodeID=" + updatedTest[2];
			  }	
			  
			  if (updatedTest[3] !== null && updatedTest[3] !== undefined) {
				  values = values + ", Mnemonic='" + updatedTest[3] + "'";
			  }	
			  
			  if (updatedTest[6] !== null && updatedTest[6] !== undefined) {
				  values = values + ", DepartmentID=" + updatedTest[6];
			  }		
			  console.log(values);
			  
			querying("UPDATE [ACM_ORM].[TestManual].[LISTests] SET " + values + " WHERE LISTestID =" + LISTestID + ";",function (err, result) {
              if (err) {
                console.log(err);
                res.status.internalServerError(err);
              } else {
                res.object({'status': 'ok'}).send();
              }
            });
          }
        });
      },

      DELETE: function(req, res) {
        var LISTestID = req.uri.child();
		
		console.log('delete');

        querying("DELETE FROM [ACM_ORM].[TestManual].[LISTests] WHERE LISTestID = " + LISTestID + ";", function(err, result) {
          if (err) {
            console.log(err);
            res.status.internalServerError(err);
          } else {
            res.object({'status': 'ok'}).send();
          }
        });
      }
    }
  );


  return server;
};

module.exports = {'Server': Server};
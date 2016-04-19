var querystring = require('querystring');
var https = require('http');

var host = 'localhost';
var username = 'lkong';
var password = '123';
var apiKey = '*****';
var sessionId = null;
var deckId = '68DC5A20-EE4F-11E2-A00C-0858C0D5C2ED';

function performRequest(endpoint, method, data, success) {
  var dataString = JSON.stringify(data);
  var headers = {};
  
  if (method == 'GET') {
    endpoint += '?' + querystring.stringify(data);
  }
  else {
    headers = {
      'Content-Type': 'application/json',
      'Content-Length': dataString.length
    };
  }
  var options = {
    host: host,
    path: endpoint,
    method: method,
    headers: headers
  };

  var req = https.request(options, function(res) {
    res.setEncoding('utf-8');

    var responseString = '';

    res.on('data', function(data) {
      responseString += data;
    });

    res.on('end', function() {
      console.log(responseString);
      var responseObject = JSON.parse(responseString);
      success(responseObject);
    });
  });

  req.write(dataString);
  req.end();
}


function login( username, password) {
  performRequest('/ApplicationManager/api/values', 'POST', {
	AppID: '10',
    Username: username,
    Password: password
  }, function(data) {
    //sessionId = data.result.id;
	console.log('Logged in:', data.Username);
    console.log('Logged in:', data.ValidToken);
  });
}

login('lkong', 'TACgod44');
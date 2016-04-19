

function logout( res, cookie) {
  if (cookie === null || cookie === undefined) {
	  res.statusCode = 302;
		res.setHeader("Location", '../#/account');
		res.end();
		
		return true;
  }
  
  if (cookie.indexOf('user=') < 0){
	  res.statusCode = 302;
		res.setHeader("Location", '../#/account');
		res.end();
		
		return true;
  }
  
  return false;
}

module.exports = {'logout': logout};
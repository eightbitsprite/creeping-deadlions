var data = require('../data.json');
/*
 * GET home page.
 */

exports.view = function(req, res){
	var user_list = data["user"];
	var current_user = null;
	user_list.forEach(function(entry){
		if(entry["name"] == req.query.login_username && entry["password"] == req.query.login_password)
			current_user = entry;
	});
	console.log("found user: ", current_user);

  	res.render('index', {
  		"data" : data,
  		"current_user" : current_user
  	});
};

var data = require('../data.json');

exports.view = function(req, res){
	if(req.query){
		var new_user = {
			"id" : req.query.form_id,
			"name" : req.query.form_user,
			"password" : req.query.form_password,
			"village_level" : 1
		};
		data["user"].push(new_user);	
		console.log("new user is", new_user);
	}
	
	res.render('login', {"id":data["user"].length});
};
exports.data = function(req, res) { 
  	res.json(data['user']);
}
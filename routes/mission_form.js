var data = require('../data.json');
/*
 * GET home page.
 */

exports.view = function(req, res){
  //	res.render('mission_form', {"id" : data["task"].length});
  	var username = req.query.username_new_mission;
  	console.log(req.query);
 	res.render('mission_form', {"username" : username});
};

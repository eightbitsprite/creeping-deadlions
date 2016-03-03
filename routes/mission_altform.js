var data = require('../data.json');
/*
 * GET home page.
 */

exports.view = function(req, res){
  	//res.render('mission_form2', {"id" : data["task"].length});
  	res.render("mission_form2");
};

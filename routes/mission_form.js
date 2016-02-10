var data = require('../data.json');
/*
 * GET home page.
 */

exports.view = function(req, res){
  	res.render('mission_form', {"id" : data["task"].length});
};

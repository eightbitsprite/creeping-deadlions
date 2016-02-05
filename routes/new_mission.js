var data = require('../data.json');

exports.view = function(req, res){
	var new_mission = {
		"name": req.query.mission_name,
		"subtasks": req.query.subtasklist.split("|/0|"),
		"duedate" : req.query.duedate,
		"days" : [],
		"runner" : req.query.runner,
		"untildate" : req.query.untildate
	}
	data["missions"].push(new_mission);
  	res.render('new_mission');
};
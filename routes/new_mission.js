var data = require('../data.json');

exports.view = function(req, res){
	var new_mission = {
		"name": req.query.mission_name,
		"subtasks": ["Task 1", "Task 2", "Task 3"],
		"duedate" : req.query.duedate,
		"days" : [],
		"runner" : req.query.runner,
		"untildate" : req.query.untildate
	}
	data["missions"].push(new_mission);
  	res.render('new_mission');
};
var data = require('../data.json');

exports.new = function(req, res){
	var days = [];

	if(req.query.recurring){
		if(req.query.sunday)
			days.push("Sunday");
		if(req.query.monday)
			days.push("Monday");
		if(req.query.tuesday)
			days.push("Tuesday");
		if(req.query.wednesday)
			days.push("Wednesday");
		if(req.query.thursday)
			days.push("Thursday");
		if(req.query.friday)
			days.push("Friday");
		if(req.query.saturday)
			days.push("Saturday");	
	}

	var new_mission = {
		"id" : req.query.new_id,
		"user_id" : req.query.user_id,
		"name": req.query.mission_name,
		"subtasks": req.query.subtasklist.split("|/0|"),
		"duedate" : req.query.duedate,
		"days" : days,
		"runner" : req.query.runner,
		"untildate" : req.query.untildate
	}
	data["task"].push(new_mission);
  	res.render('new_mission');
};

exports.complete = function(req, res){
	var completed_mission = {
		"user_id" : req.query.user_id,
		"task_id" : req.query.task_id,
		"completed" : true
	};

	/*TODO: save completion*/
	
	res.render('mission_complete');
};
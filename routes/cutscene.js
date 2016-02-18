var data = require('../data.json');

exports.new = function(req, res){
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
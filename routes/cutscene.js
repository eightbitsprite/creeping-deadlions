var data = require('../data.json');

exports.new = function(req, res){

	var datalist = [];
	if(req.query.recurring){
		if(req.query.sunday)
			datalist.push({"title" :"Sunday", "completed" : false});
		if(req.query.monday)
			datalist.push({"title" :"Monday", "completed" : false});
		if(req.query.tuesday)
			datalist.push({"title" :"Tuesday", "completed" : false});
		if(req.query.wednesday)
			datalist.push({"title" :"Wednesday", "completed" : false});
		if(req.query.thursday)
			datalist.push({"title" :"Thursday", "completed" : false});
		if(req.query.friday)
			datalist.push({"title" :"Friday", "completed" : false});
		if(req.query.saturday)
			datalist.push({"title" :"Saturday", "completed" : false});	
	}else{
		var list = req.query.subtasklist.split("|/0|");
		for(var i = 0;i < list.length; i++){
			var newtask = {
				"title":list[i], 
				"completed":false
			};
			list.push(newtask);
		}
	}
	

	var new_mission = {
		"id" : req.query.new_id,
		"user_id" : req.query.user_id,
		"resource_id" : 0,
		"runner_id" : 1,
		"title": req.query.mission_name,
		"subtasks": datalist, 
		"deadline" : req.query.duedate,
		"runner" : req.query.runner,
		"untildate" : req.query.untildate,
		"time_due" : req.query.duetime
	}
	//console.log(new_mission);
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
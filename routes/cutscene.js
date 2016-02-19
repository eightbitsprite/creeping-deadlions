var data = require('../data.json');

exports.new = function(req, res){
  	res.render('new_mission');
};

exports.complete = function(req, res){
	res.render('mission_complete');
};
exports.view = function(req, res){
  	res.render('village', { 
  		"food_count": 4,
  		"stone_count": 5,
  		"wood_count": 7,
  		"food_total": 25,
  		"stone_total": 25,
  		"wood_total": 25,
  		
  		"village_stage": "Tent City",
  		"village_nextstage": "Small Hamlet",

  		"image_link": "/images/village_stage01.gif"
  	});
};

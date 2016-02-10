exports.view = function(req, res){
  	res.render('village', { 
  		"food_count": 5,
  		"stone_count": 5,
  		"wood_count": 5,
  		"food_total": 25,
  		"stone_total": 25,
  		"wood_total": 25,

  		"image_link": "/images/eduworld_map.jpg"
  	});
};

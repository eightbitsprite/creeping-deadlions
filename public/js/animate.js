'use strict';

$(document).ready(function() {
	/*New Mission Animations*/
	setAnimation();
})

function setAnimation(){
	$("#deadlion_animate").css({
		"margin-left": - $("#animation_screen").offset().left - $("#deadlion_animate").width()
	});
	$("#runner_start").css("margin-left", - $("#animation_screen").offset().left - $("#runner_start").width());
	$("#deadlion_animate").hide();
	$("#runner_start").animate({
		"margin-left" : $("#animation_screen").width()
	}, 6000, function(){
		$("#deadlion_animate").css("top", 0);
		$("#deadlion_animate").show();

		$("#deadlion_animate").animate({
			"margin-left" : $("#animation_screen").offset().left + $("#animation_screen").width()
		}, 3000);
	});
	
}


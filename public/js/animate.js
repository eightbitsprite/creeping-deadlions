'use strict';

$(document).ready(function() {
})

function newMission(){
	$("#runner_start").attr("src", window.runner + "_panic_run.gif");
	$("#deadlion_animate").css({
		"margin-left": - $("#animation_screen").offset().left - $("#deadlion_animate").width()
	});
	$("#runner_start").css("margin-left", - $("#animation_screen").offset().left - $("#runner_start").width());
	$("#deadlion_animate").hide();
	$("#runner_start").animate({
		"margin-left" : $("#animation_screen").width()
	}, 4000, function(){
		$("#deadlion_animate").css("top", 0);
		$("#deadlion_animate").show();

		$("#deadlion_animate").animate({
			"margin-left" : $("#animation_screen").offset().left + $("#animation_screen").width()
		}, 3000, function(){
			window.location = "/";
		});
	});
	
}

function completeMission(){
	$("#runner_start").css("margin-left", - $("#animation_screen").offset().left - $("#runner_start").width());
	$("#runner_start").animate({
		"margin-left" : $("#animation_screen").width()
	}, 4000, function(){
		window.location = "/";
	});
}

function failedMission(){

}
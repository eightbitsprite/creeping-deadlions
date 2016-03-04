'use strict';

$(document).ready(function() {
	console.log(- ($("#animation_screen").width() + $("#runner_start").outerWidth() + 10))
	$("#runner_start").css("margin-left", - ($("#animation_screen").width() + $("#runner_start").outerWidth() + 10));
})

function newMission(){
	console.log("runner", window.localStorage.getItem("runner")) ;
	$("#runner_start").attr("src", "/images/" + window.localStorage.getItem("runner") + "_panic_run.gif");
	$("#deadlion_animate").css({
		"margin-left": - $("#animation_screen").offset().left - $("#deadlion_animate").width()
	});
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
	$("#runner_start").attr("src", "/images/" + window.localStorage.getItem("runner") + "_happy_run.gif");
	$("#resource").attr("src", "/images/resource_" + window.localStorage.getItem("resource") + ".png");
	$(".resource_earned").html("1 " + window.localStorage.getItem("resource"));
	
	$("#runner_start").animate({
		"margin-left" : $("#animation_screen").width()
	}, 4000, function(){
		window.location = "/";
	});
}

function failedMission(){
	//transform: rotate(90deg);
	$("#runner_fail").attr("src", "/images/" + window.localStorage.getItem("runner") + "_panic_static.png");
	$('#deadlion_fail').animate({  borderSpacing: -60 }, {
	    step: function(now,fx) {
	     // $(this).css('-webkit-transform','rotate('+ -now+'deg)'); 
	      //$(this).css('-moz-transform','rotate('+ -now+'deg)');
	      //$(this).css('transform','rotate('+ -now+'deg)');
	    }, 
	    duration:3000,
	    queue:false
	},'linear');
	$("#deadlion_fail").animate({
		//"margin-left" : $("#animation_screen").width() / 2,
	}, {duration: 3000, queue:false}, function(){
		window.location = "/";
	});
	
/*
	

	$("#runner_start").animate({
		"margin-left" : $("#animation_screen").width()
	}, 4000, function(){
		//window.location = "/";
	});
*/
}
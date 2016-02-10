'use strict';

$(document).ready(function() {
	initializePage();
})

function initializePage() {
	if(!$("#current_user_data").val() && !window.current_user){
		console.log("not logged in");
		location.replace("/login#sign-in");
	}else{
		console.log("current_user:", window.current_user);
		window.current_user = $("#current_user_data").val();
	}
	$("#menu_log").click(showLog);
	$("#menu_history").click(showHistory);
	$("#menu_help").click(showHelp);
} 

function showLog() {
	$("#missions").css("display","block");
	$("#history").css("display","none")
	$("#help").css("display","none")
}
function showHistory() {
	$("#missions").css("display","none")
	$("#history").css("display","block")
	$("#help").css("display","none")
}
function showHelp() {
	var missions, history, population, village;
	missions = $("#missions");
	history = $("#history");
	population = $("#population");
	village = $("#village");

	if(missions) {missions.css("display","none");}
	if(history) {history.css("display","none");}
	if(population) {population.css("display","none");}
	if(village) {village.css("display","none");}

	$("#help").css("display","block")
}
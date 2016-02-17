'use strict';

$(document).ready(function() {
	initializePage();
})

function initializePage() {
	if(!window.localStorage.getItem("current_user")){
		console.log("not logged in");
		location.replace("/login#sign-in");
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
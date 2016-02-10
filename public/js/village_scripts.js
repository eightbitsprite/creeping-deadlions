'use strict';

$(document).ready(function() {
	initializePage();
})

function initializePage() {
	//Menu listeners
	$("#menu_help").click(showHelp);
	$("#menu_village").click(showVillage);
	$("#menu_population").click(showPopulation);
} 

/* Menu functions: showLog, showHistory, showHelp */
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
function showVillage() {
	$("#village").css("display","block")
	$("#population").css("display","none")
	$("#help").css("display","none")
}
function showPopulation() {
	$("#village").css("display","none")
	$("#population").css("display","block")
	$("#help").css("display","none")
}
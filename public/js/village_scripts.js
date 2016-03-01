'use strict';

$(document).ready(function() {
	initializePage();
})

function initializePage() {
	//Menu listeners
	$("#menu_help").click(showHelp);
	$("#menu_village").click(showVillage);
	$("#menu_population").click(showPopulation);

	renderVillage();
} 

function renderVillage() { 
	console.log("rendering village");
	var username = JSON.parse(window.localStorage.getItem("current_user")).username;
	var userObject = Parse.Object.extend("User");
	//var ObjectiveObject = Parse.Object.extend("Objective");
	var query = new Parse.Query(userObject);
	query.equalTo("user", username);
	query.greaterThanOrEqualTo("villageLevel", 0);
	query.find(
		success:function(result) {
			console.log(result);
			if (!result) {
				console.log("That's strange. Something should be happening.");
				return;
			}
			else {
				$("#village_display").append("<div><img src='/images/tentcity.gif'></div>");
			}
	});
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
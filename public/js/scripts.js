'use strict';

var runners = ["Granny PawPaw", 
				"Jawnny", 
				"Purrrla", 
				"Roarie", 
				"Jessimba", 
				"Clawdia", 
				"Cat-alina",
				"Pawlette", 
				"Kingsley", 
				"Maully", 
				"Char-mane", 
				"Cubby",
				"Scarface", 
				"Denzel",
				"Fury", 
				"Abyss", 
				"Ragdoll", 
				"Zaimese", 
				"Fold", 
				"Manx", 
				"Savannah", 
				"Bobby", 
				"Mau", 
				"Bombei", 
				"Korat", 
				"Muffin",
				"Burmilla"];
var subtaskString = "";

$(document).ready(function() {
	initializePage();
})

function initializePage() {
	//Menu listeners
	$("#menu_log").click(showLog);
	$("#menu_history").click(showHistory);
	$("#menu_help").click(showHelp);
	$("#menu_village").click(showVillage);
	$("#menu_population").click(showPopulation);

	//Original listeners
	$("#new_mission_button").click(newMission);
	$("#add_task_button").click(addSubtask);
	$("#new_cancel_button").click(function(event){
		event.preventDefault();
		cancelMission();
	});
	$("#new_mission_name_textbox").keydown(openTaskFrequency);
	$("#new_freq_timed").change(toggleTimed);
	$("#new_freq_recurring").change(toggleRecurring);
	$("#new_task_until_date").click(openSubtasks);
	$("#new_task_due_date").click(openSubtasks);
	$("#new_runner_randomize").click(generateRunner);
	$("#new_runner_textbox").keydown(selectRunner);
	$(".cancel_mission").click(function(event){
		console.log($("#" + event.target.id).attr("data"));
	});
	
} 

function newMission(){
	$("#new_mission").css("display","block");
	$("#help1").css("display", "block");
	subtaskString = "";
}

function openTaskFrequency(){
	$("#help1").css("display", "none");
	$("#new_frequency_input").css("display","block");
	$("#help2").css("display", "block");
}

function toggleTimed(){
	$("#new_freq_recurring_area").css("display","none");
	$("#new_freq_timed_area").css("display","block");
}

function toggleRecurring(){
	$("#new_freq_recurring_area").css("display","block");
	$("#new_freq_timed_area").css("display","none");
}

function openSubtasks(){
	$("#help2").css("display", "none");
	$("#help3").css("display", "block");
	$("#new_subtask_input").css("display", "block");
}

function addSubtask(){
	var subtask = $("#new_subtask_textbox").val();
	$("#new_subtasks").append("<li><input type='checkbox' id='check_" + subtask + "'/><label class='subtask' for='check_" + subtask + "'>"+ subtask + "</label></li>");
	subtaskString += subtask + "|/0|";
	$("#hiddensubtasks").val(subtaskString);
	$("#new_subtask_textbox").val("");
	$("#help3").css("display", "none");
	$("#help4").css("display", "block");
	$("#new_select_runner").css("display", "block");
}

function selectRunner(){
	$("#help4").css("display", "none");
	$("#new_input_submit").css("display", "block");
}

function cancelMission(){
	$("#new_mission").css("display","none");
	$("#new_mission_name_textbox").val("");
	$("#new_subtask_textbox").val("");
	$("#new_subtasks").html("");
}

function generateRunner(){
	selectRunner();
	$("#new_runner_textbox").val(runners[(Math.floor(Math.random() * (runners.length-1)) + 1)]);
}

/* Menu functions: showLog, showHistory, showHelp */
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
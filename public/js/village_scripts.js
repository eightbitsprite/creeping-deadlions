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
	$("#add_task_button").click(addSubtask);
	$("#new_mission_name_textbox").keydown(openTaskFrequency);
	$("#new_freq_timed").change(toggleTimed);
	$("#new_freq_recurring").change(toggleRecurring);
	$("#new_runner_randomize").click(generateRunner);
} 

function openTaskFrequency(){
	$("#new_frequency_input").css("display","block");
}

function toggleTimed(){
	$("#new_freq_recurring_area").css("display","none");
	$("#new_freq_timed_area").css("display","block");
}

function toggleRecurring(){
	$("#new_freq_recurring_area").css("display","block");
	$("#new_freq_timed_area").css("display","none");
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

function generateRunner(){
	selectRunner();
	$("#new_runner_textbox").val(runners[(Math.floor(Math.random() * (runners.length-1)) + 1)]);
}
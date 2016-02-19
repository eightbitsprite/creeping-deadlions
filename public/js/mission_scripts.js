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
	Parse.initialize("YXlPjDOZPGg2dnC4z2XBGHk5xg8jirJVclFEMTmo", "IWqi5XWUalPKb9uXMX8WCkFNaEuyrIxTzOeH9tPH");
})

function initializePage() {
	$("#add_task_button").click(addSubtask);
	$("#new_mission_name_textbox").keydown(openTaskFrequency);
	$("#new_freq_timed").change(freqDetails);
	$("#new_freq_recurring").change(freqDetails);
	$("#new_runner_randomize").click(generateRunner);
	$("#new_run_button").click(saveTask)
	$("#freqDetailsBtn").click(freqDetails);
	$(".modalSaveBtn").click(modalSave)
} 

function openTaskFrequency(){
	$("#new_frequency_input").css("display","block");
}

/*
function toggleTimed(){
	$("#new_freq_recurring_area").css("display","none");
	$("#new_freq_timed_area").css("display","block");
}

function toggleRecurring(){
	$("#new_freq_recurring_area").css("display","block");
	$("#new_freq_timed_area").css("display","none");
}
*/
function freqDetails(){
	if(!$("#new_freq_recurring").is(":checked") && !$("#new_freq_timed").is(":checked")){
		$("#error_msg").empty();
		$("#error_msg").append("<p>Please select a frequency type before proceeding.</p>");
		return;
	}
	var freqType = $("input[name=frequency]:checked").attr("id");
	var modalContent, modalHead;
	console.log(freqType);
	if (freqType === "new_freq_recurring") {
		//modalContent = $("#new_freq_recurring_area").html();
		modalHead = "Recurring Event Details";
		$("#recurFreq .modal-title").empty().append(modalHead);
		$("#recurFreq").modal("toggle");
	} else {
		//modalContent = $("#new_freq_timed_area").html();
		modalHead = "Timed Event Details";
		$("#timedFreq .modal-title").empty().append(modalHead);
		$("#timedFreq").modal("toggle");
	}
		//$("#recurFreq .modal-title").empty().append(modalHead);
		//$("#recurFreq .modal-body").empty().append(modalContent);
		//$("#recurFreq").modal("toggle");
}
function modalSave() {
	var freqType = $("input[name=frequency]:checked").attr("id");
	var modalContent = $("#recurFreq .modal-body").html();
	if (freqType === "new_freq_recurring") {
		//$("#new_freq_recurring_area").empty().append(modalContent);
		$("#recurFreq").modal("toggle");
	} else {
		//$("#new_freq_timed_area").empty().append(modalContent);
		$("#timedFreq").modal("toggle");
	}
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
	$("#new_runner_textbox").val(runners[(Math.floor(Math.random() * (runners.length-1)) + 1)]);
}

function saveTask(){
	/*Validation*/
	var title = $("#new_mission_name_textbox").val();
	var runner = null;
	var resource = null;
	var user = window.localStorage.getItem("current_user");
	var deadline;
	var subtasks = [];
	debugger;

	var isValid = true;
	$("#error_msg").html("");
	if(title.trim() == ""){
		$("#error_msg").append("<p>Mission name is required.</p>");
		isValid = false;
	}
	if(!$("#new_freq_recurring").is(":checked") && !$("#new_freq_timed").is(":checked")){
		$("#error_msg").append("<p>Please select a frequency type before proceeding.</p>");
		isValid = false;
	}
	if($("#new_freq_recurring").is(":checked") && $("#new_task_recurring_dates").find(":checked").length == 0){
		$("#error_msg").append("<p>You must select at least one day for recurring task.</p>");
		isValid = false;
	}
	if($("#new_freq_timed").is(":checked") && subtaskString == ""){
		$("#error_msg").append("<p>You must add at least one subtask.</p>");
		isValid = false;
	}
	/*Check time validity*/

	if(!isValid){
		if($("#new_freq_recurring").attr("checked")){
			deadline = $("#new_task_until_date").val();
			var days = [];
			//if($("#sunday_box").is(":checked"))
			//	days.push()
		}else{
			deadline = $("#new_task_due_date").val();
			var list = subtaskString.split("|/0|");
			for(var i = 0;i < list.length - 1; i++){
				var newtask = {
					"id" : i,
					"title":list[i], 
					"completed":false
				};
				subtasks.push(newtask);
			}
		}
		console.log("subtasks", subtasks);
		/*
		var TaskObject = Parse.Object.extend("Task");
		var task = new TaskObject();
		task.save({
			title: title,
			runner : runner,
			resouce : resource,
			user : user,
			completed : false,
			deadline : deadline,
			subtasks : subtasks
		});*/
	}
}
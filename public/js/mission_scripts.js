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
	$("#new_freq_timed").change(toggleTimed);
	$("#new_freq_recurring").change(toggleRecurring);
	$("#new_runner_randomize").click(generateRunner);
	$("#new_run_button").click(saveTask);
	$("#select_all").click(checkAll)
	var current = new Date();
	console.log("current", current.getDate()+1);

	$(".date-select").val(new Date());
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
	var isRecurring = $("#new_freq_recurring").is(":checked");

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
		$("#error_msg").append("<p>Please select at least one day for recurring task.</p>");
		isValid = false;
	}
	if($("#new_freq_timed").is(":checked") && subtaskString == ""){
		$("#error_msg").append("<p>Please add at least one subtask.</p>");
		isValid = false;
	}

	if($("#new_freq_recurring").is(":checked")){
      	deadline= new Date($("#new_task_until_date").val());
      	deadline.setHours(23);
      	deadline.setMinutes(59);
      	deadline.setSeconds(59);
	}else if($("#new_freq_timed").is(":checked")){
      	deadline= new Date($("#new_task_due_date").val());
      	var dueTime = $("#new_task_due_time").val();
      	if(!(/^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(dueTime.toString()))){
      		$("#error_msg").append("<p>Please select a valid time.</p>");
         	isValid = false;
      	}else{
	      	deadline.setHours(Number(dueTime.split(":")[0]));
	      	deadline.setMinutes(Number(dueTime.split(":")[1]));
	      	deadline.setSeconds(0);
      	}
	}
	var today =new Date();
	if (deadline.value == " "){
		$("#error_msg").append("<p>Please select a valid date.</p>");
     	isValid = false;
  	}else if(deadline < today){
  		$("#error_msg").append("<p>Please select a future date.</p>");
     	isValid = false;
  	}

	/*Check time validity*/

	if(isValid){
		if($("#new_freq_recurring").is(":checked")){
			var date= new Date();
			var days = [];

			if($("#sunday_box").is(":checked"))
				days.push(0);
			if($("#monday_box").is(":checked"))
				days.push(1);
			if($("#tuesday_box").is(":checked"))
				days.push(2);
			if($("#wednesday_box").is(":checked"))
				days.push(3);
			if($("#thursday_box").is(":checked"))
				days.push(4);
			if($("#friday_box").is(":checked"))
				days.push(5);
			if($("#saturday_box").is(":checked"))
				days.push(6);
			var index = 0;
			while(date <= deadline){
				if(days.indexOf(date.getDay()) >= 0){
					console.log("adding date", date);
					subtasks.push({
						"id": index,
						"title" : dateString(date),
						"date" : date.toString(),
						"completed":false
					});
					index ++;
				}
				date.setDate(date.getDate() + 1);
			}
		}else{
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
		
		var TaskObject = Parse.Object.extend("Task");
		var task = new TaskObject();
		task.save({
			title: title,
			runner : runner,
			resouce : resource,
			user : user.id,
			completed : false,
			deadline : deadline,
			subtasks : subtasks,
			isRecurring: $("#new_freq_recurring").is(":checked")
		});
		window.location = "/new_mission";
	}
}
function checkAll(){
	$(".day_box").prop("checked", $("#select_all").is(":checked"));
}
function dateString(date){
	var stringBuilder = "";
	switch(date.getDay()){
		case 0:
			stringBuilder += "Sunday, ";
			break;
		case 1:
			stringBuilder += "Monday, ";
			break;
		case 2:
			stringBuilder += "Tuesday, ";
			break;
		case 3:
			stringBuilder += "Wednesday, ";
			break;
		case 4:
			stringBuilder += "Thursday, ";
			break;
		case 5:
			stringBuilder += "Friday, ";
			break;
		case 6:
			stringBuilder += "Saturday, ";
			break;
	}

	switch(date.getMonth()){
		case 0:
			stringBuilder += "January ";
			break;
		case 1:
			stringBuilder += "February ";
			break;
		case 2:
			stringBuilder += "March ";
			break;
		case 3:
			stringBuilder += "April ";
			break;
		case 4:
			stringBuilder += "May ";
			break;
		case 5:
			stringBuilder += "June ";
			break;
		case 6:
			stringBuilder += "July ";
			break;
		case 7:
			stringBuilder += "August ";
			break;
		case 8:
			stringBuilder += "September ";
			break;
		case 9:
			stringBuilder += "October ";
			break;
		case 10:
			stringBuilder += "November ";
			break;
		case 11:
			stringBuilder += "December ";
			break;
	}

	stringBuilder += date.getDate();
	switch(date.getDate()){
		case 1:
			stringBuilder += "st";
			break;
		case 1:
			stringBuilder += "nd";
			break;
		case 1:
			stringBuilder += "rd";
			break;
		default:
			stringBuilder += "th";
	}
	return stringBuilder;
}
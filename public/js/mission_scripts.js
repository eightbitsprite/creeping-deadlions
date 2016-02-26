'use strict';
var runners = ["Granny PawPaw", 
				"Purrrla", 
				"Roarie", 
				"Jessimba", 
				"Catalina",
				"Pawlette", 
				"Kingsley", 
				"Cubby",
				"Scarface", 
				"Denzel",
				"Fury", 
				"Abyss", 
				"Ragdoll", 
				"Zaimese", 
				"Fold", 
				"Manx", 
				"Bobby", 
				"Mau", 
				"Bombei", 
				"Korat", 
				"Muffin",
				"Burmilla"];
var subtaskString = "";
var subtaskIndex = 0;
var repeat_dates = [];

$(document).ready(function() {
	Parse.initialize("YXlPjDOZPGg2dnC4z2XBGHk5xg8jirJVclFEMTmo", "IWqi5XWUalPKb9uXMX8WCkFNaEuyrIxTzOeH9tPH");
	initializePage();
	
})

function initializePage() {
	$("#add_task_button").click(addSubtask);
	$("#new_mission_name_textbox").keydown(openTaskFrequency);
	$("#resource_selection_box").click(openRunnersAndResources);
	$("#new_runner_randomize").click(generateRunner);
	$("#new_run_button").click(saveTask);
	$(".modalSaveBtn").click(modalSave);
	$("#select_all").click(checkAll);
	$("#new_freq_recurring").change(toggleRecurring);
	$( "#new_task_due_date" ).datepicker();
	$("#new_task_until_date").datepicker();
	$("#next_button").click(nextPage);
	$("#back_button").click(previousPage);

	$("#new_subtask_textbox").keydown(function(event){
		if(event.keyCode == 13){
			addSubtask();
		}
	});
	$(".runner_box .item_radio").change(selectRunner);

	var current = new Date();
	console.log("current", current.getDate()+1);
	$("#objectives").css("display", "none");

	$(".date-select").val(new Date());
} 

function nextPage(){
	/*Validation*/
	var title = $("#new_mission_name_textbox").val().trim();
	var runner = null;
	var resource = null;
	var user = JSON.parse(window.localStorage.getItem("current_user"));
	var deadline;
	var isRecurring = $("#new_freq_recurring").is(":checked");
	var isValid = true;
	repeat_dates = [];
	var daysString = "";

	$("#error_msg").html("");

	if(title.trim() == ""){
		$("#error_msg").append("<p>Mission name is required.</p>");
		isValid = false;
	}

	if($(".runner_box .item_radio:checked").length == 0){
		$("#error_msg").append("<p>Please select a runner.</p>");
		isValid = false;
	}

	if($(".resource_box .item_radio:checked").length == 0){
		$("#error_msg").append("<p>Please select a resource.</p>");
		isValid = false;
	}

	console.log($("#new_task_due_date").val());
	if($("#new_task_due_date").val().trim() == ""){
		$("#error_msg").append("<p>Please select a valid " + (($("#new_freq_recurring").is(":checked"))? "start" : "due") + " date.</p>");
     	isValid = false;
	}else{
		deadline= new Date($("#new_task_due_date").val());
		var dueTime = $("#new_task_due_time").val();
      	if(!(/^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(dueTime.toString()))){
      		$("#error_msg").append("<p>Please select a valid time.</p>");
         	isValid = false;
      	}else{
	      	deadline.setHours(Number(dueTime.split(":")[0]) + 24);
	      	deadline.setMinutes(Number(dueTime.split(":")[1]));
	      	deadline.setSeconds(0);
      	}
      	var today=new Date();
      	if(deadline < today && !$("#new_freq_recurring").is(":checked")){
  			$("#error_msg").append("<p>Please select a future due date.</p>");
     		isValid = false;
  		}
	}

	if($("#new_freq_recurring").is(":checked")){	
		var until_date;
		if($("#new_task_until_date").val().trim() == ""){
			$("#error_msg").append("<p>Please select a valid end date.</p>");
			isValid = false;
		}else{
			var today = new Date();
			until_date = new Date($("#new_task_until_date").val());
			if(until_date < today){
				$("#error_msg").append("<p>Please select a future end date.</p>");
				isValid = false;
			}else if(until_date < deadline){
				$("#error_msg").append("<p>End date must be after start date.</p>");
				isValid = false;
			}
		}
		if(isValid){
			
			var days = [];
			
			if($("#sunday_box").is(":checked")){
				days.push(0);
				daysString += "Su,";
			}
				
			if($("#monday_box").is(":checked")){
				daysString += "M,";
				days.push(1);
			}
			if($("#tuesday_box").is(":checked")){
				daysString+="T,";
				days.push(2);
			}
			if($("#wednesday_box").is(":checked")){
				days.push(3);
				daysString+= "W,";
			}
			if($("#thursday_box").is(":checked")){
				days.push(4);
				daysString +="Th,"
			}
			if($("#friday_box").is(":checked")){
				days.push(5);
				daysString += "F,";
			}
				
			if($("#saturday_box").is(":checked")){
				days.push(6);
				daysString += "S,";
			}
			
			if(days.length ==0){
				isValid = false;
				$("#error_msg").append("<p>Please select at least one day to repeat mission.</p>");
			}else{
				var index = 0;
				var date= new Date();
				while(date <= until_date){
					if(days.indexOf(date.getDay()) >= 0){
						console.log("adding date", date);
						repeat_dates.push({
							"id": index,
							"title" : dateString(date, true),
							"date" : date.toString(),
							"completed":false
						});
						index ++;
					}
					date.setDate(date.getDate() + 1);
				}

				if(repeat_dates.length ==0){
					isValid = false;
					$("#error_msg").append("<p>None of days selected occur between given start and end date.</p>");
				}	
			}		
		}
	}else{
		repeat_dates.push({
			"id": 0,
			"date" : dateString(deadline, true),
			"completed":false
		});
		$("#selected_mission_date").append("<option id='option_0' selected>Default")
	}
	if(isValid){
		$("#frequency").css("display", "none");
		$("#objectives").css("display", "block");		
	}
}

function previousPage(){
	$("#frequency").css("display", "block");
	$("#objectives").css("display", "none");
}

function toggleRecurring(event){
	if($("#new_freq_recurring").is(":checked"))
		$("#new_freq_recurring_area").slideDown();
	else
		$("#new_freq_recurring_area").slideUp();
	$("#due_text").html(($("#new_freq_recurring").is(":checked")) ? "Start:" : "Due:");
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
function openRunnersAndResources(){
	var modalContent, modalHead;
	modalContent = $("#new_freq_recurring_area").html();
	modalHead = "Runners and Resources";
	$("#recurFreq .modal-title").empty().append(modalHead);
	$("#recurFreq").modal("toggle");
}
function modalSave() {
	var isValid = true;

	$("#modal_error_msg").html("");
	if($(".runner_box .item_radio:checked").length == 0){
		$("#modal_error_msg").append("<p>Please select a runner.</p>");
		isValid = false;
	} else if($("#new_runner_textbox").val().trim() == ""){
		$("#modal_error_msg").append("<p>Runner name cannot be blank.</p>");
		isValid = false;
	}

	if($(".resource_box .item_radio:checked").length == 0){
		$("#modal_error_msg").append("<p>Please select a resource.</p>");
		isValid = false;
	}

	

  	if(isValid){
  		console.log("runner", $(".runner_box .item_radio:checked img"));
  		console.log("resource", $(".resource_box .item_radio:checked img").attr("src"));
  		var runner = $("#new_runner_textbox").val().trim();
		var resource = $(".resource_box .item_radio:checked").attr("id");

		var runner_img = $(".runner_box .item_radio:checked + label img").attr("src");
		var resource_img = $(".resource_box .item_radio:checked + label img").attr("src");

  		$("#modal_error_msg").html("");
		$("#recurFreq").modal("toggle");
		$("#selected_runner_img").attr("src", runner_img);
		$("#selected_resource_img").attr("src", resource_img);
		$("#selected_runner_name").html( runner);
		$("#selected_resource_name").html(resource);
		//$("#freqDetailsBtn").text(((freqType === "new_freq_timed")? "Due at: " : "End on: ") + dateString(deadline, freqType === "new_freq_timed"));
  	}
}

function addSubtask(){
	var subtask = $("#new_subtask_textbox").val();
	$("#new_subtasks").append("<li id='subtask_item_" + subtaskIndex + "'>"
									+ "<h4 class='subtask' for='check_" + subtaskIndex + "' id='subtask_" + subtaskIndex + "'>"
									+ 		"<span class='pull-right'>"
									+			"<span id='edit_" + subtaskIndex + "' class='edit_subtask glyphicon glyphicon-pencil' aria-hidden='true'></span>"
									+			"<span id='delete_" + subtaskIndex + "' class='delete_subtask glyphicon glyphicon-remove' aria-hidden='true'></span>"
									+		"</span>"
									+ 		subtask 
									+ "</h4></li>");
	$("#subtask_" + subtaskIndex).data("data", subtask);
	$("#new_subtask_textbox").val("");
	
	$("#edit_" + subtaskIndex).click(editSubtask);
	$("#delete_" + subtaskIndex).click(deleteSubtask);
	subtaskIndex++;
}

function generateRunner(){
	$("#new_runner_textbox").val(runners[(Math.floor(Math.random() * (runners.length-1)) + 1)]);
}

function saveTask(){
	/*Validation*/
	var title = $("#new_mission_name_textbox").val().trim();
	var runner = null;
	var resource = null;
	var user = JSON.parse(window.localStorage.getItem("current_user"));
	var deadline;
	var subtasks = [];
	var isRecurring = $("#new_freq_recurring").is(":checked");
	var isValid = true;
	$("#error_msg").html("");
	if(title.trim() == ""){
		$("#error_msg").append("<p>Mission name is required.</p>");
		isValid = false;
	}

	if($(".runner_box .item_radio:checked").length == 0){
		$("#error_msg").append("<p>Please select a runner.</p>");
		isValid = false;
	}else if($("#new_runner_textbox").val().trim() == ""){
		$("#error_msg").append("<p>Runner name cannot be blank.</p>");
		isValid = false;
	}

	if($(".resource_box .item_radio:checked").length == 0){
		$("#error_msg").append("<p>Please select a resource.</p>");
		isValid = false;
	}

	

	if($("#new_freq_recurring").is(":checked")){
      	deadline= new Date($("#new_task_until_date").val());
      	deadline.setHours(23 + 24);
      	deadline.setMinutes(59);
      	deadline.setSeconds(59);
	}else if($("#new_freq_timed").is(":checked")){
      	deadline= new Date($("#new_task_due_date").val());
      	var dueTime = $("#new_task_due_time").val();
      	if(!(/^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(dueTime.toString()))){
      		$(error_msg).append("<p>Please select a valid time.</p>");
         	isValid = false;
      	}else{
	      	deadline.setHours(Number(dueTime.split(":")[0]) + 24);
	      	deadline.setMinutes(Number(dueTime.split(":")[1]));
	      	deadline.setSeconds(0);
      	}
	}
	var today =new Date();
	if (deadline.value == " "){
		$(error_msg).append("<p>Please select a valid date.</p>");
     	isValid = false;
  	}else if(deadline < today){
  		$(error_msg).append("<p>Please select a future date.</p>");
     	isValid = false;
  	}
  	var daysString = "";
	if(isValid){
		if($("#new_freq_recurring").is(":checked")){
			var date= new Date();
			var days = [];
			
			if($("#sunday_box").is(":checked")){
				days.push(0);
				daysString += "Su,";
			}
				
			if($("#monday_box").is(":checked")){
				daysString += "M,";
				days.push(1);
			}
			if($("#tuesday_box").is(":checked")){
				daysString+="T,";
				days.push(2);
			}
			if($("#wednesday_box").is(":checked")){
				days.push(3);
				daysString+= "W,";
			}
			if($("#thursday_box").is(":checked")){
				days.push(4);
				daysString +="Th,"
			}
			if($("#friday_box").is(":checked")){
				days.push(5);
				daysString += "F,";
			}
				
			if($("#saturday_box").is(":checked")){
				days.push(6);
				daysString += "S,";
			}
				
			var index = 0;
			while(date <= deadline){
				if(days.indexOf(date.getDay()) >= 0){
					console.log("adding date", date);
					subtasks.push({
						"id": index,
						"title" : dateString(date, false),
						"date" : date.toString(),
						"completed":false,
					});
					index ++;
				}
				date.setDate(date.getDate() + 1);
			}
		}else{
			var list = $("#new_subtasks").find(".subtask");
			for(var i = 0;i < list.length; i++){
				console.log(list[i].tagName );
				var newtask = {
					"id" : i,
					"title": (list[i].tagName == "LABEL") ? $("#" + list[i].id).data("data") : $("#" + list[i].id).val(), 
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
			user : user.username,
			completed : false,
			deadline : deadline,
			subtasks : subtasks,
			isRecurring: $("#new_freq_recurring").is(":checked"),
			failed:false,
			totalTasks : subtasks.length,
			completedTasks: 0,
			failedTasks: 0,
			dates : (daysString) ? daysString.substring(0, daysString.length-1) : null
		}, {
			success:function(){
				window.location = "/new_mission";
			}
		});
	}
}
function checkAll(){
	if($("#select_all").is(":checked"))
		$(".day_box").prop("checked", true);
}

function checkDateExists(deadline){

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
			return true;
		}
		date.setDate(date.getDate() + 1);
	}
	return false;
}

function editSubtask(event){
	event.preventDefault();
	event.stopPropagation();
	var el = event.target.parentNode.parentNode;
	var title = $("#" + el.id).data("data");
	var index = el.id.split("_")[1];
	$("#" + el.parentNode.id).html("<input type='text' value='" + title + "' class='subtask' id='editing_" + index + "'/>"
						+	"<span id='submit_" + index + "' class='submit_subtask glyphicon glyphicon-ok' aria-hidden='true'></span>");
	$("#submit_" + index).click(submitSubtask);
	$("#editing_" + index).keydown(function(event){
		if(event.keyCode == 13)
			submitSubtask(event);
	});
}
function deleteSubtask(event){
	event.preventDefault();
	event.stopPropagation();
	var el = event.target.parentNode.parentNode.parentNode;
	console.log(el);
	el.remove();
}
function submitSubtask(event){
	var el = event.target;
	var index = el.id.split("_")[1];
	console.log(el.id);
	var title = $("#editing_" + index).val().trim();
	$("#" + el.parentNode.id).html("<h4 class='subtask' for='check_" + index + "' id='subtask_" + index + "'>"
									+ 		"<span class='pull-right'>"
									+			"<span id='edit_" + index + "' class='edit_subtask glyphicon glyphicon-pencil' aria-hidden='true'></span>"
									+			"<span id='delete_" + index + "' class='delete_subtask glyphicon glyphicon-remove' aria-hidden='true'></span>"
									+		"</span>"
									+ 		title 
									+ "</h4>");
	$("#edit_" + index).click(editSubtask);
	$("#delete_" + index).click(deleteSubtask);
	$("#subtask_" + index).data("data", title);
}

function selectRunner(event){
	var presets = ["Maully", "Deniel", "Clawdia", "Charmane", "Savannah", "Jawnny"];
	if($("#new_runner_textbox").val().trim()=="" || presets.indexOf($("#new_runner_textbox").val().trim()) >= 0){
		$("#new_runner_textbox").val(event.target.id);
	}
}
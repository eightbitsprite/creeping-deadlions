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
var subtaskIndex = 0;

$(document).ready(function() {
	Parse.initialize("YXlPjDOZPGg2dnC4z2XBGHk5xg8jirJVclFEMTmo", "IWqi5XWUalPKb9uXMX8WCkFNaEuyrIxTzOeH9tPH");
	initializePage();
	
})

function initializePage() {
	$("#add_task_button").click(addSubtask);
	$("#new_mission_name_textbox").keydown(openTaskFrequency);
	$("#new_freq_timed").change(freqDetails);
	$("#new_freq_recurring").change(freqDetails);
	$("#new_runner_randomize").click(generateRunner);
	$("#new_run_button").click(saveTask);
	$("#freqDetailsBtn").click(freqDetails);
	$(".modalSaveBtn").click(modalSave);
	$("#select_all").click(checkAll);
	$("#new_subtask_textbox").keydown(function(event){
		if(event.keyCode == 13){
			addSubtask();
		}
	});

	var current = new Date();
	console.log("current", current.getDate()+1);

	$(".date-select").val(new Date());

	var Runner = Parse.Object.extend("Runner");
	var query = new Parse.Query(Runner);
	var runners = query.find({
		async:false,
	    success: function (results) {
	    	console.log("results", results);
	    	return results;
	    }
	});	    	
	console.log(runners.result);
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
	var error_msg = (freqType === "new_freq_recurring")? "#recur_error_msg" : "#timed_error_msg";
	var modalContent = $("#recurFreq .modal-body").html();
	var deadline;
	var isValid = true;
	$(error_msg).html("");
	$("#error_msg").html("");

	if(freqType === "new_freq_recurring" && $("#new_task_recurring_dates").find(":checked").length == 0){
		$(error_msg).append("<p>Please select at least one day for recurring task.</p>");
		isValid = false;
	}
	if(freqType === "new_freq_timed" && $("#new_subtasks").find(".subtask").length < 1){
		$(error_msg).append("<p>Please add at least one subtask.</p>");
		isValid = false;
	}
	var today =new Date();
	if(freqType === "new_freq_recurring"){
		if($("#new_task_until_date").val().toString().trim() == ""){
			$(error_msg).append("<p>Please select a valid date.</p>");
     		isValid = false;
		}
	  	if(isValid){
			deadline= new Date($("#new_task_until_date").val());
			deadline.setHours(23 + 24);
	      	deadline.setMinutes(59);
	      	deadline.setSeconds(59);
			if(deadline < today){
		  		$(error_msg).append("<p>Please select a future date.</p>");
		     	isValid = false;
		  	}else if(!checkDateExists(deadline)){
		  		$(error_msg).append("<p>Please select a day that occurs before given until date.</p>");
		  		isValid = false;
		  	}
		  	
		}
	}else if(freqType === "new_freq_timed"){
		if($("#new_task_due_date").val().toString().trim() == ""){
			$(error_msg).append("<p>Please select a valid date.</p>");
     		isValid = false;
		}else{
			deadline= new Date($("#new_task_due_date").val());
			var dueTime = $("#new_task_due_time").val();
	      	if(!(/^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(dueTime.toString()))){
	      		$(error_msg).append("<p>Please select a valid time.</p>");
	         	isValid = false;
	      	}
			deadline.setHours(24 + Number(dueTime.split(":")[0]));
	      	deadline.setMinutes(Number(dueTime.split(":")[1]));
	      	deadline.setSeconds(0);
	      	
			if(deadline < today){
		  		$(error_msg).append("<p>Please select a future date.</p>");
		     	isValid = false;
		  	}
		}      	
	}
	
	
  	if(isValid){
  		
  		$(error_msg).html("");
  		if (freqType === "new_freq_recurring") {
			//$("#new_freq_recurring_area").empty().append(modalContent);
			$("#recurFreq").modal("toggle");
		} else {
			//$("#new_freq_timed_area").empty().append(modalContent);
			$("#timedFreq").modal("toggle");
		}
		$("#freqDetailsBtn").text(((freqType === "new_freq_timed")? "Due at: " : "End on: ") + dateString(deadline, freqType === "new_freq_timed"));
  	}
}

function addSubtask(){
	var subtask = $("#new_subtask_textbox").val();
	$("#new_subtasks").append("<li id='subtask_item_" + subtaskIndex + "'><input type='checkbox' id='check_" + subtaskIndex + "'/>"
									+ "<label class='subtask' for='check_" + subtaskIndex + "' id='subtask_" + subtaskIndex + "'>"
									+ 		subtask 
									+ 		"<span class='pull-right'>"
									+			"<a class='edit_subtask btn' id='edit_" + subtaskIndex + "'>Edit</a>"
									+			"<a class='delete_subtask btn' id='delete_" + subtaskIndex + "'><strong>X</strong></a>"
									+		"</span>"
									+ "</label></li>");
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
	
	/*Check time validity*/
	if(!$("#new_freq_recurring").is(":checked") && !$("#new_freq_timed").is(":checked")){
		$(error_msg).append("<p>Please select a frequency type before proceeding.</p>");
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
			if($("#new_subtask_textbox").val().trim()!=""){
				subtasks.push({
					"id" : subtasks.length,
					"title": $("#new_subtask_textbox").val(), 
					"completed":false
				});
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
	$(".day_box").prop("checked", $("#select_all").is(":checked"));
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
						+	"<a class='submit_subtask btn' id='submit_" + index + "'>Submit</a>");
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
	$("#" + el.parentNode.id).html("<input type='checkbox' id='check_" + index + "'/>"
									+ "<label class='subtask' for='check_" + index + "' id='subtask_" + index + "'>"
									+ 		title 
									+ 		"<span class='pull-right'>"
									+			"<a class='edit_subtask btn' id='edit_" + index + "'>Edit</a>"
									+			"<a class='delete_subtask btn' id='delete_" + index + "'><strong>X</strong></a>"
									+		"</span>"
									+ "</label>");
	$("#edit_" + index).click(editSubtask);
	$("#delete_" + index).click(deleteSubtask);
	$("#subtask_" + index).data("data", title);
}
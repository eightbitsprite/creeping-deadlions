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
var objectives = [];
var current_mission_objectives = [];

$(document).ready(function() {
	Parse.initialize("YXlPjDOZPGg2dnC4z2XBGHk5xg8jirJVclFEMTmo", "IWqi5XWUalPKb9uXMX8WCkFNaEuyrIxTzOeH9tPH");
	initializePage();
	
})

function initializePage() {
	$("#add_task_button").click(addSubtask);
	$("#resource_selection_box").click(openRunnersAndResources);
	$("#new_runner_randomize").click(generateRunner);
	$("#new_run_button").click(saveTask);
	$(".modalSaveBtn").click(modalSave);
	$("#select_all").click(checkAll);
	$("#new_freq_recurring").change(toggleRecurring);
	//$( "#new_task_due_date" ).datepicker();
	$( "#new_task_due_date" ).datepicker({
		onSelect: function(date, inst) {
			allDesignLoadSelector();
			freqUnset(); 
		} 
	});
	//$("#new_task_until_date").datepicker();
	$( "#new_task_until_date" ).datepicker({
		onSelect: function(date, inst) {
			allDesignLoadSelector();
			freqUnset(); 
		} 
	});
	$("#next_button").click(nextPage);
	$("#back_button").click(previousPage);
	$("#left-switch").click(previousOption);
	$("#right-switch").click(nextOption);
	$("#selected_mission_date").change(switchSubtask);
	$("#apply_to_all_btn").change(applyAll);

	$("#new_subtask_textbox").keydown(function(event){
		if(event.keyCode == 13){
			addSubtask();
		}
	});
	$(".runner_box .item_radio").change(selectRunner);

	var current = new Date();
	console.log("current", current.getDate()+1);

	if(isAllDesign()) {
		$("#objectives").click(allDesignNextPage);
		//$("#apply_to_all_btn").attr('checked', false);
		$(".apply_all_wrapper").css("display", "none");
		//add events to check if ANY input value in
		//frequency has changed
		$("#new_mission_name_textbox").on("input",freqUnset);
		$("#select_all").on("change",freqUnset);
		$(".day_box").on("change",freqUnset);
		//$("#new_task_until_date").on("input",freqUnset);
		freqUnset();
		//console.log("objectives_click event added");
	} else {
		$("#objectives").css("display", "none");
	}

	$(".date-select").val(new Date());
	$("#apply_to_all_btn").prop("disabled", true);
	$("#apply_to_all_btn+label").text("Create one default objective first.");

	googleATimeCheck(0,Date.now());
} 
function onClosed() {
	//debugger;

}
/*Check to see if .all_design is present*/
function isAllDesign() {
	return ($("body").hasClass("all_design"));
}
/*Unsets freq_set class */
function freqUnset() {
	//debugger;
	if (isAllDesign()) {
		$("body").removeClass("freq_set");
		console.log("freq_set: set to false");
	}
}
/*Check to see if frequency is set (assuming validity)*/
function isFreqSet() {
	if (!isAllDesign()) {
		console.log("regular mission, freq_set unimportant");
		return false;
	}
	return $("body").hasClass("freq_set");
}
/*Check to make sure frequency is filled out alright*/
function frequencyCheckerAllDesign() {
	//debugger;
	if (!isAllDesign()) {
		return true;
	}
	
	var objectives_ok = $("body").hasClass("objectives_okay");
	//$("#error_msg").empty();
	if ( objectives_ok) {
		return true;
	} else {
		/*Reinforcement of #frequency correctness*/
		$("#alldesign_error_msg").fadeIn(400);
		$("#alldesign_error_msg").html("<p>Invalid settings. Check above for more details.</p>")
		$("#alldesign_error_msg").delay(750).fadeOut(200);
		$("#apply_to_all_btn").attr('checked', false);
		$("#apply_to_all_btn").prop("disabled", true);

		freqUnset();
		return false;
	}	
}

function previousOption(){
	if (!frequencyCheckerAllDesign()) {
		return;
	}
	var el = $("#selected_mission_date");
	console.log(el.find(":selected").attr("id"));
	var index = Number(el.find(":selected").attr("id").split("_")[1]);
	index --;
	if(index < 0)
		index = repeat_dates.length-1;
	$("#option_"+index).prop("selected", true);
	switchSubtask();
}
function nextOption(){
	if (!frequencyCheckerAllDesign()) {
		return;
	}
	var el = $("#selected_mission_date");
	console.log(el.find(":selected").attr("id"));
	var index = Number(el.find(":selected").attr("id").split("_")[1]);
	index ++;
	if(index >= repeat_dates.length)
		index = 0;
	$("#option_"+index).prop("selected", true);
	switchSubtask();
}

function switchSubtask(){
	//debugger;
	if (!frequencyCheckerAllDesign()) {
		return;
	}

	console.log("changed");
	console.log($("#selected_mission_date").find(":selected"));
	
	current_mission_objectives = $("#selected_mission_date").find(":selected").data("data");
	$("#new_subtasks").html("");
	if(current_mission_objectives.length == 0){
		$("#new_subtasks").append('<p id="subtask_prompt"><em>No objectives found. Enter objectives below.</em></p>');
	}else{
		for(subtaskIndex = 0; subtaskIndex < current_mission_objectives.length; subtaskIndex++){
			$("#new_subtasks").append("<li id='subtask_item_" + subtaskIndex + "'>"
										+ "<h4 class='subtask' for='check_" + subtaskIndex + "' id='subtask_" + subtaskIndex + "'>"
										+ 		"<span class='pull-right'>"
										+			"<span id='edit_" + subtaskIndex + "' class='edit_subtask subtask_glyphicon glyphicon glyphicon-pencil' aria-hidden='true'></span>"
										+			"<span id='delete_" + subtaskIndex + "' class='delete_subtask subtask_glyphicon glyphicon glyphicon-remove' aria-hidden='true'></span>"
										+		"</span>"
										+ 		"<span class='subtask_name'>" + current_mission_objectives[subtaskIndex] + "</span>" 
										+ "</h4></li>");
			$("#subtask_" + subtaskIndex).data("data", current_mission_objectives[subtaskIndex]);
			$("#new_subtask_textbox").val("");
			$("#edit_" + subtaskIndex).click(editSubtask);
			$("#delete_" + subtaskIndex).click(deleteSubtask);
		}
	}
}

function nextPage(){
	/*Validation*/
	var title = $("#new_mission_name_textbox").val().trim();
	var runner = null;
	var resource = null;
	var user = Parse.User.current().toJSON();
	var deadline;
	var isRecurring = $("#new_freq_recurring").is(":checked");
	var isValid = true;
	repeat_dates = [];
	var daysString = "";
	$("#new_subtasks").html("");
	$("#new_subtasks").append('<p id="subtask_prompt"><em>No objectives found. Enter objectives below.</em></p>');
	$("#error_msg").html("");

	if(title.trim() == ""){
		$("#error_msg").append("<p>Mission name is required.</p>");
		isValid = false;
	}

	if($(".resource_box .item_radio:checked").length == 0 || $(".runner_box .item_radio:checked").length == 0){
		$("#error_msg").append("<p>Please select a runner and resource.</p>");
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
	      	deadline.setHours(Number(dueTime.split(":")[0]));
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
			until_date.setHours(24);
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
			}else { 
				var index = 0;
				var date= new Date($("#new_task_due_date").val());
				date.setHours(Number(dueTime.split(":")[0]) + 24);
	      		date.setMinutes(Number(dueTime.split(":")[1]));
	      		date.setSeconds(0);
				console.log(date);
				while(date <= until_date){
					if(days.indexOf(date.getDay()) >= 0){
						console.log("adding date", date);
						repeat_dates.push({
							"id": index,
							"date" : dateString(date),
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
			"date" : dateString(deadline),
			"completed":false
		});
	
	}
	loadSelector(); 
	if(isValid){
		if (!isAllDesign){
		$("#frequency").css("display", "none");
		$("#objectives").css("display", "block");		
		}
	}
	ga("send", "event", "next_page", "page_change");	
	return isValid;
}
function loadSelector(){
	var dropdown = $("#selected_mission_date");
	dropdown.html("");
	if(repeat_dates.length ==1)
		$(".apply_all_wrapper").css("display", "none");
	else
		$(".apply_all_wrapper").css("display", "block");
	for(var i = 0; i < repeat_dates.length; i++){
		console.log(repeat_dates[i]);
		$("#selected_mission_date").append("<option id='option_" + i + "' " + ((i==0)? "selected" : "") + ">" 
											+ repeat_dates[i].date + "</option>");
		$("#option_" + i).data("data", []);
	}
}
function nextCheck() {
	/*Validation*/
	var title = $("#new_mission_name_textbox").val().trim();
	var runner = null;
	var resource = null;
	var user = Parse.User.current().get("username");
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

	if($(".resource_box .item_radio:checked").length == 0 || $(".runner_box .item_radio:checked").length == 0){
		$("#error_msg").append("<p>Please select a runner and resource.</p>");
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
			until_date.setHours(24);
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
			if($("#saturday_box").is(":checked")){
				days.push(6);
				daysString += "S,";
			}
			if(days.length ==0){
				isValid = false;
				$("#error_msg").append("<p>Please select at least one day to repeat mission.</p>");
			}else { 
				var index = 0;
				var date= new Date($("#new_task_due_date").val());
				date.setHours(Number(dueTime.split(":")[0]) + 24);
	      		date.setMinutes(Number(dueTime.split(":")[1]));
	      		date.setSeconds(0);
				console.log(date);
				while(date <= until_date){
					if(days.indexOf(date.getDay()) >= 0){
						console.log("nextCheck() call: adding date", date);
						repeat_dates.push({
							"id": index,
							"date" : dateString(date),
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
			"date" : dateString(deadline),
			"completed":false
		});
	
		}
	}
	return isValid;	
}
function allDesignNextPage () {
	var isValid = nextCheck();
	var objectives_ok = $("body").hasClass("objectives_okay");
	//debugger;
	if (isValid && objectives_ok && isFreqSet()) {
		return;
	} else if (isValid) {
		$("body").addClass("objectives_okay");
		if (isFreqSet() === false) { 
			nextPage();
			$("body").addClass("freq_set");
		}
	} else {
		$("body").removeClass("objectives_okay");
		freqUnset();
	}
	frequencyCheckerAllDesign();
}
function allDesignLoadSelector() {
	//debugger;
	var isValid = true;
	var deadline;

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
	      	deadline.setHours(Number(dueTime.split(":")[0]));
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
		until_date.setHours(24);
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
		}else { 
			var index = 0;
			var date= new Date($("#new_task_due_date").val());
			date.setHours(Number(dueTime.split(":")[0]) + 24);
      		date.setMinutes(Number(dueTime.split(":")[1]));
      		date.setSeconds(0);
			console.log(date);
			while(date <= until_date){
				if(days.indexOf(date.getDay()) >= 0){
					console.log("adding date", date);
					repeat_dates.push({
						"id": index,
						"date" : dateString(date),
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
			"date" : dateString(deadline),
			"completed":false
		});
	}
	$("#selected_mission_date").empty();
	if(isValid) { loadSelector();}
}

function previousPage(){
	if($("body").hasClass("all_design")) {
		console.log ("all_design tags present");
		return;
	}
	$("#frequency").css("display", "block");
	$("#objectives").css("display", "none");
	ga("send", "event", "previousPage", "page_change");	
}

function toggleRecurring(event){
	if($("#new_freq_recurring").is(":checked"))
		$("#new_freq_recurring_area").slideDown();
	else
		$("#new_freq_recurring_area").slideUp();
	$("#due_text").html(($("#new_freq_recurring").is(":checked")) ? "Start:" : "Due:");

	freqUnset();
}

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

		var runner_img = "/images/" + $(".runner_box .item_radio:checked + label img").attr("id") + "_happy_static.png";
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
	//debugger;
	if (!frequencyCheckerAllDesign()) {
		return;
	}

	console.log("called");
	var subtask = $("#new_subtask_textbox").val();
	$("#subtask_error_msg").html("");
	if(subtask.trim()== ""){
		$("#subtask_error_msg").append("<p>Field cannot be blank</p>");
	}else{
		$("#subtask_prompt").css("display", "none");
		console.log($("#new_subtasks"));
		$("#new_subtasks").append("<li id='subtask_item_" + subtaskIndex + "'>"
									+ "<h4 class='subtask' for='check_" + subtaskIndex + "' id='subtask_" + subtaskIndex + "'>"
									+ 		"<span class='pull-right'>"
									+			"<span id='edit_" + subtaskIndex + "' class='edit_subtask subtask_glyphicon glyphicon glyphicon-pencil' aria-hidden='true'></span>"
									+			"<span id='delete_" + subtaskIndex + "' class='delete_subtask subtask_glyphicon glyphicon glyphicon-remove' aria-hidden='true'></span>"
									+		"</span>"
									+ 		"<span class='subtask_name'>" + subtask + "</span>" 
									+ "</h4></li>");
		$("#subtask_" + subtaskIndex).data("data", subtask);
		current_mission_objectives.push(subtask);
		$("#selected_mission_date").find(":selected").data("data", current_mission_objectives);
		$("#new_subtask_textbox").val("");
		$("#edit_" + subtaskIndex).click(editSubtask);
		$("#delete_" + subtaskIndex).click(deleteSubtask);
		subtaskIndex++;
		$("#apply_to_all_btn").prop("disabled", false);
		$("#apply_to_all_btn+label").text("Apply All");
		if($("#apply_to_all_btn").is(":checked")){
			applyAll();
		}
	}
}

function generateRunner(){
	$("#new_runner_textbox").val(runners[(Math.floor(Math.random() * (runners.length-1)) + 1)]);
}

function saveTask(){
	/*if frequencyCheckerAllDesign() returns true, then continue
	execution*/
	if (!frequencyCheckerAllDesign()) {
		return;
	}
	
	/*Validation*/
	var title = $("#new_mission_name_textbox").val().trim();
	var runner = null;
	var resource = null;
	var user = Parse.User.current().toJSON();
	var isRecurring = $("#new_freq_recurring").is(":checked");
	var deadline = (isRecurring)? new Date($("#new_task_until_date").val()) : new Date($("#new_task_due_date").val());
	var isValid = true;
	var daysString = "";

	$("#error_msg").html("");

	if(title.trim() == ""){
		$("#error_msg").append("<p>Mission name is required.</p>");
		isValid = false;
	}

	var dueTime = $("#new_task_due_time").val();
	deadline.setHours(Number(dueTime.split(":")[0]));
  	deadline.setMinutes(Number(dueTime.split(":")[1]));
  	deadline.setSeconds(0);

  	if(isRecurring){	
		if($("#sunday_box").is(":checked")) daysString += "Su,";	
		if($("#monday_box").is(":checked"))daysString += "M,";
		if($("#tuesday_box").is(":checked"))daysString+="T,";
		if($("#wednesday_box").is(":checked"))daysString+= "W,";
		if($("#thursday_box").is(":checked"))daysString +="Th,"
		if($("#friday_box").is(":checked"))daysString += "F,";
		if($("#saturday_box").is(":checked"))daysString += "S,";
	}

	var options = $("#selected_mission_date option");
	for(var i = 0; i < options.length; i++){
		if($(options[i]).data("data").length == 0){
			$(options[i]).prop("selected", true);
			switchSubtask();
			$("#objectives_error_msg").append("<p>Empty mission detected.</p>");
			var isValid = false;
			break;
		}
	}

	if(isValid){	
		var MissionObject = Parse.Object.extend("Mission");
		var MissionInfoObject = Parse.Object.extend("Objective");
		var mission = new MissionObject();
		window.localStorage.setItem("runner",  $(".runner_box input[type='radio']:checked+label img").attr("id"));

		$(".loading_modal").modal({"show":true});
		$("body").prop("disabled",true);
		mission.save({
			title: title,
			runner : $(".runner_box input[type='radio']:checked+label img").attr("id"),
			runnerName: $("#new_runner_textbox").val().trim(),
			resource : $(".resource_box input[type='radio']:checked+label img").attr("id"),
			user : user.username,
			completed : false,
			deadline : deadline,
			failed:false,
			totalTasks : options.length,
			completedTasks: 0,
			failedTasks: 0,
			dates : (daysString) ? daysString.substring(0, daysString.length-1) : null
		}).then(function() {
			var promise = Parse.Promise.as();
			var increment = 1/ options.length;
			$(".mission_title").text(title);
			 _.each(options, function(select) {
			 	promise = promise.then(function(){
			 		var missionInfo = new MissionInfoObject();	
					console.log($(select).text());
					var current_list = $(select).data("data");
					var subtasks_list = [];
					for(var s = 0; s < current_list.length; s++){
						subtasks_list.push({
							"title": current_list[s],
							"id" : s,
							"completed" : false
						});
					}

					if(options.length > 10){
						increment += 1/options.length;
						console.log((increment * 100));
						$("#runner-load").css("margin-left", (increment * 100) + "%");
					}	

					return missionInfo.save({
						missionId: mission.id,
						subtasks: subtasks_list,
						completed: false,
						index: Number($(select).attr("id").split("_")[1]),
						title: $(select).text(),
						failed : false,
						deadline : $(select).data("date")
					}, {
						success:function(){
							return Parse.Promise.as("success!");
						}
					});
			 	});
			});
			return promise;
		}).then(function(){
			$("body").prop("disabled",false);
			$("#lion-load").css("display", "block");
			$("#runner-load").animate({
				"margin-left" : (options.length > 10)? $("#runner-load").css("margin-left") + 10 : $(".loading_progress_background").offset().left + $(".loading_progress_background").width()}, 
				(options.length > 10)? 100 : 4000, function(){
					$("#lion-load").animate({
						"margin-left" : $(".loading_progress_background").offset().left + $(".loading_progress_background").width()}, 
							3000, function(){
								window.location = "/";
						});
				});
			googleATimeCheck(1, Date.now());
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
	if(confirm("Are you sure you want to delete objective: " + $(el).find(".subtask_name").text())){
		console.log(el);
		el.remove();
		saveObjectives();
	}
}
function submitSubtask(event){
	var el = event.target;
	var index = el.id.split("_")[1];
	var title = $("#editing_" + index).val().trim();
	$("#" + el.parentNode.id).html("<h4 class='subtask' for='check_" + index + "' id='subtask_" + index + "'>"
									+ 		"<span class='pull-right'>"
									+			"<span id='edit_" + index + "' class='edit_subtask glyphicon glyphicon-pencil' aria-hidden='true'></span>"
									+			"<span id='delete_" + index + "' class='delete_subtask glyphicon glyphicon-remove' aria-hidden='true'></span>"
									+		"</span>"
									+ 		title 
									+ "</h4>");
	$("#subtask_" + index).data("data", title);
	saveObjectives();
	$("#edit_" + index).click(editSubtask);
	$("#delete_" + index).click(deleteSubtask);
	$("#subtask_" + index).data("data", title);
}

function selectRunner(event){
	var presets = ["Maully", "Deniel", "Clawdia", "Charmane", "Roarie", "Jawnny"];
	if($("#new_runner_textbox").val().trim()=="" || presets.indexOf($("#new_runner_textbox").val().trim()) >= 0){
		$("#new_runner_textbox").val(event.target.id);
	}
	$(".runner_box input[type='radio']+label img").each(function(){
		this.src = "/images/" + this.id + "_happy_static.png";
	});
	var el = $(".runner_box input[type='radio']:checked+label img");
	el.attr("src", "/images/" + el.attr("id") + "_happy_run.gif");
	//freqUnset() call
	freqUnset();
}

function applyAll(){
	if (!frequencyCheckerAllDesign()) {
		return;
	}

	if(current_mission_objectives.length == 0){
		$("#objectives_error_msg").append("<p>Enter at least one objective first.</p>");
		return false;
	}else{
		var options = $("#selected_mission_date option");
		for(var i = 0; i < options.length; i++){
			var newArray = current_mission_objectives.slice();
			$(options[i]).data("data", newArray);
		}
	}
	return true;
}

function saveObjectives(){
	current_mission_objectives = [];
	var list = $("#new_subtasks .subtask");
	for(var i = 0; i < list.length; i++){
		console.log($("#" + list[i].id).data("data"));
		current_mission_objectives.push($("#" + list[i].id).data("data"));
	}
	$("#selected_mission_date").find(":selected").data("data", current_mission_objectives);
	if($("#apply_to_all_btn").is(":checked")){
		applyAll();
	}
}


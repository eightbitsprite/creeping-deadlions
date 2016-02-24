'use strict';

$(document).ready(function() {
	Parse.initialize("YXlPjDOZPGg2dnC4z2XBGHk5xg8jirJVclFEMTmo", "IWqi5XWUalPKb9uXMX8WCkFNaEuyrIxTzOeH9tPH");
	console.log("user",JSON.parse(window.localStorage.getItem("current_user")));
	if(JSON.parse(window.localStorage.getItem("current_user")) == null){
		console.log("not logged in");
		window.location = "/login#sign-in";
	}else{
		
		$("#menu_log").click(showLog);
		$("#menu_history").click(showHistory);
		$("#menu_help").click(showHelp);
		$("#menu_village").click(showVillage);
		$("#history-completed-button").click(showCompleted);
		$("#history-failed-button").click(showFailed);
		$("#failed-missions-list").css("display", "none");
		$("#logoutbutton").click(logOut);
		renderMissions();
		renderCompleted();
		renderFailed();
	}
})
function logOut(){
	window.localStorage.setItem("current_user", null);
	window.location = "/login#sign-in";
}
function showCompleted(){
	$("#completed-missions-list").css("display", "block");
	$("#failed-missions-list").css("display", "none");
	$("#history-completed-button").addClass("btn-selected");
	$("#history-failed-button").removeClass("btn-selected");
}
function showFailed(){
	$("#completed-missions-list").css("display", "none");
	$("#failed-missions-list").css("display", "block");
	$("#history-completed-button").removeClass("btn-selected");
	$("#history-failed-button").addClass("btn-selected");
}

function showLog() {
	$("#missions").css("display","block");
	$("#history").css("display","none");
	$("#village").css("display","none");
	$("#help").css("display","none");
}
function showHistory() {
	$("#missions").css("display","none");
	$("#history").css("display","block");
	$("#village").css("display","none");
	$("#help").css("display","none");
}
function showVillage() {
	$("#missions").css("display","none");
	$("#history").css("display","none");
	$("#village").css("display","block");
	$("#help").css("display","none");
}
function showHelp() {
	$("#missions").css("display","none");
	$("#history").css("display","none");
	$("#village").css("display","none");
	$("#help").css("display","block");
}


function renderMissions(){
	var username = JSON.parse(window.localStorage.getItem("current_user")).username;
	var Task = Parse.Object.extend("Task");
	var query = new Parse.Query(Task);
	query.equalTo("user", username);
	query.equalTo("completed", false);
	query.equalTo("failed", false);
	query.find({
	    success: function (results) {

	    	if(results.length == 0){
	    		 $("#missions-list").html("<li class='default-list'><em>No missions to display. <br/>Click <strong>'New Mission'</strong> to create a new mission.</em></li>");
	    	}else{
	    		var htmlBuilder = "";
		        for (var i = 0; i < results.length; i++) {
		            var data = results[i].toJSON();
		           	var subtaskHtml = "";
		           	var space = "&nbsp;&nbsp;&nbsp;&nbsp;";
		           	if(data.isRecurring){
		           		if(data.subtasks.length == 0)
		           			subtaskHtml += "<li>No dates found. Click button to complete task!</li>";
		           		else
		           			subtaskHtml += "<li><input id='" + data.objectId + "_" + data.subtasks[0].id + "'  type='checkbox' class='subtask_check'" + ((data.subtasks[0].completed)? "checked" : "") + "/>"
		           					+ "<label for='"+ data.objectId + "_" + data.subtasks[0].id + "'>" + data.subtasks[0].title + "</label></li>";
		           	}else{
		           		for(var s = 0; s < data.subtasks.length; s++){
			           		subtaskHtml += "<li><input id='" + data.objectId + "_" + data.subtasks[s].id + "'  type='checkbox' class='subtask_check'" + ((data.subtasks[s].completed)? "checked" : "") + "/>"
			           					+ "<label for='"+ data.objectId + "_" + data.subtasks[s].id + "'>" + data.subtasks[s].title + "</label></li>";
			           		if(data.subtasks[s].completed)
			           			space += "&nbsp;&nbsp;&nbsp;";
			           	}
		           	}

		           	var date = dateString(new Date(data.deadline.iso), !data.isRecurring);
		           	console.log("date is", date);
		            htmlBuilder += "<li class='mission_box container current_mission' id='" + data.objectId +"''>"
		            				+ "<ul class='dropdown-menu pull-right' aria-labelledby='dropdownMenu4'>"
  									+ 	"<li><a class='editl_mission'>Edit</a></li>"
  									+ 	"<li><a class='cancel_mission'>Delete</a></li></ul>"
		            				+ "<div class='runner-progress'>"
		            				+  		"<img src='" + "/images/lion-run-test.gif" +"' class='gif' id='lion_" + data.objectId + "'/>"
		            				+		"<span class='distance'>" + space + "</span>"
		            				+		"<img src='/images/run-test.gif' class='gif runner_gif' id='runner_" + data.objectId + "'/>"
		            				+	"</div>"
		            				+	"<h4 class='pull-right'>" + ((data.isRecurring)? data.dates + "<br/>Until: " : "Due: ") + date + "</h4>"
		            				+	"<br/><h3>Mission: " + data.title + "</h3>"
		            				+ 	"<ul class='list-unstyled subtasks-list'>" + subtaskHtml + "</ul>"
		            				+	"<a class='btn btn-custom pull-right cancel_mission' id='cancel_" + data.objectId + "'>Cancel</a>"
		            				+	"<a class='btn pull-right complete_mission btn-custom' id='complete_" + data.objectId + "'></a>"
		            				+ "</li>"
		        }
		        $("#missions-list").html(htmlBuilder);
		        for (var i = 0; i < results.length; i++) {
		        	var data = results[i].toJSON();
		             $("#" + data.objectId).data("parseObject", results[i]);

		             /*Set up progress bar*/
		             if(data.isRecurring){
		             	console.log($("#lion_" + data.objectId));
		             	$("#lion_" + data.objectId).css("margin-left", (Math.ceil((data.failedTasks / data.totalTasks) / 2) * 100) + "%");
		             }/*else{
		             	$("#lion_" + data.objectId).css("margin-right", "0em");
		             }*/

		             /*Determine if ready to complete*/
		             var readyToComplete = $("#" + data.objectId).find(":checked").length == data.subtasks.length;
		             if(readyToComplete){
		             	$("#complete_" + data.objectId).addClass("btn-success");
		             	$("#complete_" + data.objectId).removeClass("btn-secondary-outline");
		             }else{
		             	$("#complete_" + data.objectId).removeClass("btn-success");
		             	$("#complete_" + data.objectId).addClass("btn-secondary-outline");
		             }
		           	 $("#complete_" + data.objectId).prop("disable", !readyToComplete);
		           	 $("#complete_" + data.objectId).css("cursor", (readyToComplete)? "pointer" : "not-allowed");
		           	  $("#complete_" + data.objectId).text((readyToComplete)? "Complete!" : "Incomplete");
		        }	
	    	}
	    	
	        initializePage();
	    },
	    error: function (error) {
	        alert("Error: " + error.code + " " + error.message);
	    }
	});
}

function renderCompleted(){
	var username = JSON.parse(window.localStorage.getItem("current_user")).username;
	var Task = Parse.Object.extend("Task");
	var query = new Parse.Query(Task);
	query.equalTo("user", username);
	query.equalTo("completed", true);
	query.find({
	    success: function (results) {
	    	if(results.length == 0){
	    		 $("#completed-missions-list").html("<li class='default-list'><em>No missions to display. <br/>Click <strong>'New Mission'</strong> to create a new mission.</em></li>");
	    	}else{
	    		var htmlBuilder = "";
		        for (var i = 0; i < results.length; i++) {
		            var data = results[i].toJSON();
		           	var date = dateString(new Date(data.updatedAt), true);
		            htmlBuilder += "<li class='mission_box container history_mission' id='" + data.objectId+"''>"
		            				+	"<h3>Mission: " + data.title + "</h3>"
		            				+	"<h5>Completed at: " + dateString(new Date(data.updatedAt), true) + "</h5>"
		            				+	"<h6><em>Started at: " + dateString(new Date(data.createdAt), true) + "</em></h6>"
		            				+ 	"<p>Time Elapsed: " + getTimeDifference(new Date(data.createdAt), new Date(data.updatedAt)) + "</p>"
		            				+ "</li>"
		        }
		        $("#completed-missions-list").html(htmlBuilder);
	    	}
	    },
	    error: function (error) {
	        alert("Error: " + error.code + " " + error.message);
	    }
	});
}


function renderFailed(){
	var username = JSON.parse(window.localStorage.getItem("current_user")).username;
	var Task = Parse.Object.extend("Task");
	var query = new Parse.Query(Task);
	query.equalTo("user", username);
	query.equalTo("failed", true);
	query.find({
	    success: function (results) {
	    	if(results.length == 0){
	    		 $("#failed-missions-list").html("<li class='default-list'><em>No failed missions.</em></li>");
	    	}else{
	    		console.log(results);
	    		var htmlBuilder = "";
		        for (var i = 0; i < results.length; i++) {
		            var data = results[i].toJSON();
		           	var date = dateString(new Date(data.deadline.iso), !data.isRecurring);
		            htmlBuilder += "<li class='mission_box container history_mission'>"
		            				+	"<h3>Mission: " + data.title + "</h3>"
		            				+	"<h5>Completed " + data.completedTasks + " out of " + data.totalTasks + " subtasks</h5>"
		            				+	"<h6><em>RIP: [runner name]</em></h6>"
		            				+ "</li>"
		        }
		        $("#failed-missions-list").html(htmlBuilder);
	    	}
	    },
	    error: function (error) {
	        alert("Error: " + error.code + " " + error.message);
	    }
	});
}


function initializePage() {
	$(".cancel_mission").click(cancelMission);
	$(".subtask_check").change(checkSubtask);
	$(".complete_mission").click(completeMission);
} 


function cancelMission(event){
	var to_delete = $("#" + event.target.id.split("_")[1]).data("parseObject");
	if(confirm("Are you sure you want to cancel Mission: " + to_delete.get("title") + "?")){
	    to_delete.destroy({
	    	success: function(){
	    		renderMissions();
	    	}
	    });	
  	}
}

function checkSubtask(event){
	console.log($("#" + event.target.id).is(":checked"));
	var id = event.target.id.split("_")[0];
	var index = event.target.id.split("_")[1];
	var to_update = $("#" + id).data("parseObject");
	var list = to_update.get("subtasks");
	if(to_update.get("isRecurring")){
		list.shift();
	}else{
		list[index].completed = $("#" + event.target.id).is(":checked");
	}
	to_update.set({
		"subtasks": list,
		"completedTasks": ($("#" + event.target.id).is(":checked") || to_update.get("isRecurring")) ? to_update.get("completedTasks") + 1 : to_update.get("completedTasks") - 1 
	});
	to_update.save({
		success:function(){
			renderMissions();
		}
	});

}

function completeMission(event){
	var to_complete = $("#" + event.target.id.split("_")[1]).data("parseObject");
	console.log("task", to_complete);
	var now = new Date();
	to_complete.set("completed", true);
	to_complete.save({
		success:function(){
			window.location = "/mission_complete";
		}
	})
}
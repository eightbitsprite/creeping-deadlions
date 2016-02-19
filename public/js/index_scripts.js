'use strict';

$(document).ready(function() {
	Parse.initialize("YXlPjDOZPGg2dnC4z2XBGHk5xg8jirJVclFEMTmo", "IWqi5XWUalPKb9uXMX8WCkFNaEuyrIxTzOeH9tPH");
	console.log("user",JSON.parse(window.localStorage.getItem("current_user")));
	if(!window.localStorage.getItem("current_user")){
		console.log("not logged in");
		location.replace("/login#sign-in");
	}else{
		
		$("#menu_log").click(showLog);
		$("#menu_history").click(showHistory);
		$("#menu_help").click(showHelp);
		$("#menu_village").click(showVillage);
		$("#history-completed-button").click(showCompleted);
		$("#history-failed-button").click(showFailed);
		$("#failed-missions-list").css("display", "none");
		renderMissions();
		renderCompleted();
		renderFailed();
	}
})

function showCompleted(){
	$("#completed-missions-list").css("display", "block");
	$("#failed-missions-list").css("display", "none");
}
function showFailed(){
	$("#completed-missions-list").css("display", "none");
	$("#failed-missions-list").css("display", "block");
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
	    		 $("#missions-list").append("<li><em>No missions to display. Click '+ New Mission' to create a new mission.</em></li>");
	    	}else{
	    		var htmlBuilder = "";
		        for (var i = 0; i < results.length; i++) {
		            var data = results[i].toJSON();
		           	var subtaskHtml = "";
		           	for(var s = 0; s < data.subtasks.length; s++){
		           		subtaskHtml += "<li><input id='" + data.objectId + "_" + data.subtasks[s].id + "'  type='checkbox' class='subtask_check'" + ((data.subtasks[s].completed)? "checked" : "") + "/>"
		           					+ "<label for='"+ data.objectId + "_" + data.subtasks[s].id + "'>" + data.subtasks[s].title + "</label></li>"
		           	}
		           	var date = dateString(new Date(data.deadline.iso), !data.isRecurring);
		           	console.log("date is", date);
		            htmlBuilder += "<li class='mission_box container' id='" + data.objectId+"''>"
		            				+ "<div class='runner-progress'>"
		            				+  		"<img src='" + "/images/lion-run-test.gif" +"' class='gif'/>"
		            				//+		"<span class='distance'>{{#each this.subtasks}}&nbsp;&nbsp;{{/each}}</span>
		            				+		"<img src='/images/run-test.gif' class='gif'/>"
		            				+	"</div>"
		            				+	"<h4 class='pull-right'>" + ((data.isRecurring)? "Until: " : "Due: ") + date + "</h4>"
		            				+	"<h3>Mission: " + data.title + "</h3>"
		            				+ 	"<ul class='list-unstyled subtasks-list'>" + subtaskHtml + "</ul>"
		            				+	"<a class='btn btn-default pull-right cancel_mission' id='cancel_" + data.objectId + "'>Cancel</a>"
		            				+	"<a class='btn pull-right complete_mission' id='complete_" + data.objectId + "'></a>"
		            				+ "</li>"
		        }
		        $("#missions-list").html(htmlBuilder);
		        for (var i = 0; i < results.length; i++) {
		        	var data = results[i].toJSON();
		             $("#" + data.objectId).data("parseObject", results[i]);
		             var readyToComplete = $("#" + data.objectId).find(":checked").length == data.subtasks.length;
		             console.log(data.title + " is ready? " + readyToComplete);
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
	    		 $("#completed-missions-list").append("<li><em>No missions to display. Click '+ New Mission' to create a new mission.</em></li>");
	    	}else{
	    		var htmlBuilder = "";
		        for (var i = 0; i < results.length; i++) {
		            var data = results[i].toJSON();
		           	var date = dateString(new Date(data.updatedAt), true);
		            htmlBuilder += "<li class='mission_box container' id='" + data.objectId+"''>"
		            				+	"<h3>Mission: " + data.title + "</h3>"
		            				+	"<h5>Completed at: " + dateString(new Date(data.updatedAt), true) + "</h5>"
		            				+	"<h5><em>Started at: " + dateString(new Date(data.createdAt), true) + "</em></h5>"
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
	    		 $("#failed-missions-list").append("<li><em>No failed missions.</em></li>");
	    	}else{
	    		var htmlBuilder = "";
		        for (var i = 0; i < results.length; i++) {
		            var data = results[i].toJSON();
		            var completeCount = 0;
		            for(var s = 0; s < data.subtasks.length; s++){
		            	if(data.subtasks[s].completed)
		            		completeCount++;
		            }
		           	var date = dateString(new Date(data.deadline.iso), !data.isRecurring);
		            htmlBuilder += "<li class='mission_box container>"
		            				+	"<h3>Mission: " + data.title + "</h3>"
		            				+	"<h5>Completed " + completeCount + " out of " + data.subtasks.length + " subtasks | Lost: [runner name]</h5>"
		            				+ "</li>"
		        }
		        $("#missions-list").html(htmlBuilder);
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
	var id = event.target.id.split("_")[0];
	var index = event.target.id.split("_")[1];
	var to_update = $("#" + id).data("parseObject");
	var list = to_update.get("subtasks");
	list[index].completed = true;
	to_update.set("subtasks", list);
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
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
		//renderCompleted();
		//renderFailed();
	}
})
function logOut() {
	window.localStorage.setItem("current_user", null);
	window.location = "/login#sign-in";
}
function showCompleted() {
	$("#completed-missions-list").css("display", "block");
	$("#failed-missions-list").css("display", "none");
	$("#history-completed-button").addClass("btn-selected");
	$("#history-failed-button").removeClass("btn-selected");
}
function showFailed() {
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

	$("#current_page_id").empty().append("Mission Log");
}
function showHistory() {
	$("#missions").css("display","none");
	$("#history").css("display","block");
	$("#village").css("display","none");
	$("#help").css("display","none");
	$("#current_page_id").empty().append("History");
}
function showVillage() {
	$("#missions").css("display","none");
	$("#history").css("display","none");
	$("#village").css("display","block");
	$("#help").css("display","none");
	$("#current_page_id").empty().append("My Village");
}
function showHelp() {
	$("#missions").css("display","none");
	$("#history").css("display","none");
	$("#village").css("display","none");
	$("#help").css("display","block");
	$("#current_page_id").empty().append("Help");
}


/* Renders the mission log from Parse database
	args: 	*/
function renderMissions(){
	console.log("rendering missions");
	var username = JSON.parse(window.localStorage.getItem("current_user")).username;
	var MissionObject = Parse.Object.extend("Mission");
	var ObjectiveObject = Parse.Object.extend("Objective");
	var query = new Parse.Query(MissionObject);
	query.equalTo("user", username);
	query.equalTo("completed", false);
	query.equalTo("failed", false);
	query.find({
	    success: function (results) {
	    	if(results.length == 0){
	    		 $("#missions-list").html("<li class='default-list'><em>No missions to display."
	    		 	+ "<br/>Click <strong>'New Mission'</strong> to create a new mission.</em></li>");
	    	}else{
	    		for (var i = 0; i < results.length; i++) {
	    			var mission = results[i].toJSON();
	    			console.log(mission);
	    			var htmlBuilder = "";
	    			var oquery = new Parse.Query(ObjectiveObject);
					oquery.equalTo("missionId", mission.objectId);
					oquery.equalTo("completed", false);
					oquery.equalTo("failed", false);
					oquery.find({
						async:false,
						success:function(findings){
							findings.sort(function(x, y){
							    return x.createdAt - y.createdAt;
							});
							var data = findings[0].toJSON();
							var subtaskHtml = "";
				            for(var s = 0; s < data.subtasks.length; s++){
				            	console.log(data.subtasks[i]);
				           		subtaskHtml += "<li><input id='" + data.objectId + "_" + data.subtasks[s].id + "'  type='checkbox' class='subtask_check'" + ((data.subtasks[s].completed)? "checked" : "") + "/>"
				           					+ "<label for='"+ data.objectId + "_" + data.subtasks[s].id + "'>" + data.subtasks[s].title + "</label></li>";
				           	}
				           	var date = dateString(new Date(mission.deadline.iso), true);
				           	console.log("date is", date);
							htmlBuilder +=  "<div class='mission_background'>"
									+ "<li class='mission_box container current_mission' id='" + mission.objectId +"''>"
									+ 	"<div class='pull-right btn-group mdropdown'>"
									+	 	"<a class='mdropdown-toggle' href='#' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>"
			            			+ 		"<span class='glyphicon glyphicon-chevron-down'></span>"
			            			+ 		"<span class='sr-only'>Menu</span>	</a>"
		            				+ 		"<ul class='dropdown-menu mission-dropdown' aria-labelledby='dropdownMenu4'>"
  									+ 			"<li><a class='editl_mission' id='edit_" + mission.objectId + "'>Edit</a></li>"
  									+ 			"<li><a class='cancel_mission' id='cancel_" + mission.objectId + "'>Delete</a></li>"
  									+		"</ul></div>"
  									+	 "<div class='runner-progress'>"
  									+		"<br/><div class='progress_background'>"
	  								+			"<div id='distance_" + mission.objectId + "' class='distance'></div>"
			            			+  			"<img src='" + "/images/deadlion_leap.png" +"' class='progress_img lion_img' id='lion_" + mission.objectId + "'/>"	
			            			+			"<img src='/images/" + mission.runner + "_panic_static.png' class='progress_img runner_img pull-right' id='runner_" + mission.objectId + "'/>"
		            				+		"</div>"
		            				+	"</div>"
		            				+	"<h4 class='pull-right mission_dates'>" + ((mission.dates != "")? "Every " + mission.dates  + "<br/>Until: " : "Due: ") + date + "</h4>"
									+ 	"<h3 class='subtaskToggle' id='mission_" + mission.objectId + "'>" + mission.title + "&nbsp;"
			            			+		"<span id='collapse_indicator' class='collapsed glyphicon glyphicon-chevron-up'></span>"
			            			+	"</h3>"
			            			+	"<div class='tasklist'>"
			            			+		"<ul class='list-unstyled subtasks-list'>" + subtaskHtml + "</ul>"
			            			+	"</div>"
			            			+	"<a class='btn pull-right complete_mission btn-custom' id='complete_" + mission.objectId + "'>Incomplete</a>"
			            			+ "</li></div>";
		            		$("#missions-list").append(htmlBuilder);

		            		$("#mission_"+ mission.objectId).click(toggleSubtaskList);



		            		/*for (var i = 0; i < findings.length; i++) {
					        	var data = findings[i].toJSON();
					             $("#" + data.objectId).data("parseObject", findings[i]);

					             /*Determine if ready to complete*/
					       /*      var readyToComplete = $("#" + data.objectId).find(":checked").length == data.subtasks.length;
					             if(readyToComplete){
					             	$("#complete_" + data.objectId).addClass("btn-success");
					             	$("#complete_" + data.objectId).removeClass("btn-secondary-outline");
					             }else{
					             	$("#complete_" + data.objectId).removeClass("btn-success");
					             	$("#complete_" + data.objectId).addClass("btn-secondary-outline");
					             }
					           	 $("#complete_" + data.objectId).prop("disable", !readyToComplete);
					           	 $("#complete_" + data.objectId).css("cursor", (readyToComplete)? "pointer" : "not-allowed");
					           	 $("#complete_" + data.objectId).text((readyToComplete)? "Click to Complete!" : "Incomplete");
					        }	*/
						}
					});
	    		}


	    	}
	    	/*
		        $("#missions-list").html(htmlBuilder);
		        for (var i = 0; i < results.length; i++) {
		        	var data = results[i].toJSON();
		             $("#" + data.objectId).data("parseObject", results[i]);

		             /*Set up progress bar*/
		             /*if(data.isRecurring){
		             	console.log($("#lion_" + data.objectId));
		             	$("#lion_" + data.objectId).css("margin-left", 
		             		(Math.ceil((data.failedTasks / data.totalTasks) / 2) * 100) + "%");
		             }/*else{
		             	$("#lion_" + data.objectId).css("margin-right", "0em");
		             }*/

		             /*Determine if ready to complete*/
		             /*var readyToComplete = $("#" + data.objectId).find(":checked").length == data.subtasks.length;
		             if(readyToComplete){
		             	$("#complete_" + data.objectId).addClass("btn-success");
		             	$("#complete_" + data.objectId).removeClass("btn-secondary-outline");
		             }else{
		             	$("#complete_" + data.objectId).removeClass("btn-success");
		             	$("#complete_" + data.objectId).addClass("btn-secondary-outline");
		             }
		           	 $("#complete_" + data.objectId).prop("disable", !readyToComplete);
		           	 $("#complete_" + data.objectId).css("cursor", (readyToComplete)? "pointer" : "not-allowed");
		        	 $("#complete_" + data.objectId).text((readyToComplete)? "Click to Complete!" : "Incomplete");
		        }	
		    /*
			$(".current_mission .tasklist").click(function(e) {e.stopPropagation();});
			$(".current_mission .btn").click(function(e) {e.stopPropagation();});
			$(".current_mission .mdropdown").click(function(e) {
				e.stopPropagation();
				$(".mdropdown-toggle").dropdown('toggle');
			});*/

			/* Adds click handler to allow collapsion/expansion of subtasklist*/
			$(".subtaskToggle").click(toggleSubtaskList);
	    	//}
	    	
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
	    		 $("#completed-missions-list").html("<li class='default-list'><em>No missions to display. <br/>"
	    		 	+ "Click <strong>'New Mission'</strong> to create a new mission.</em></li>");
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
		            				+	"<h5>Completed " + data.completedTasks + " out of " 
		            				+ 		data.totalTasks + " subtasks</h5>"
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

/* Collapses/Expands the subtasklist for the current mission*/
function toggleSubtaskList(event){
	var currentBox = $(this).parent();
	var currentList = currentBox.children(".tasklist");

	//debugger;
	var indicator = currentBox.find(".collapse_indicator");
	//indicator = indicator.find("span");
	//currentBox.children(".collapse_indicator").children("span");
	//indicator = indicator.children(".glphyicon");
	if (indicator.has("collapsed")) {
		indicator.toggleClass("glyphicon-chevron-up");
		indicator.toggleClass("glyphicon-chevron-down");
		indicator.toggleClass("collapsed");
	} else {
		indicator.toggleClass("glyphicon-chevron-down");
		indicator.toggleClass("glyphicon-chevron-up");
		indicator.toggleClass("collapsed");
	}

	currentList.slideToggle(100);
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
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

		setInterval(function() {
		    // your code goes here...
		    var list = $(".current_mission");
		    $.each(list, function(){
		    	var mission = $(this).data("mission").toJSON();
		    	var objective = $(this).find(".tasklist").data("parseObject").toJSON();
		    	if(!mission.completed){
		    		var target = new Date(mission.deadline.iso);
		    		var created = new Date(objective.createdAt);
		    		if(new Date() <= target){
		    			console.log((1- ((target - new Date()) / (target - created))) + "%");
		    			$("#lion_" + mission.objectId).css("margin-left", ((1- ((target - new Date()) / (target - created))) * 80) + "%");	
		    			$("#distance_" + mission.objectId).css("width", Math.min(100, (1- ((target - new Date()) / (target - created))) * 100)  + "%");
		    		}
		    		
		    	}

		    });
		}, 60 * 1000); // 60 * 1000 milsec
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
	query.find().then(function(results){
		var promise = Parse.Promise.as();
		if(results.length == 0){
    		 $("#missions-list").html("<li class='default-list'><em>No missions to display."
    		 	+ "<br/>Click <strong>'New Mission'</strong> to create a new mission.</em></li>");
    	}
    	console.log(results);
    	results.sort(function(x, y){
		    return x.updatedAt - y.updatedAt;
		});
		results.forEach(function(result){
			var mission = result.toJSON();
			var oquery = new Parse.Query(ObjectiveObject);
			oquery.equalTo("missionId", mission.objectId);
			oquery.equalTo("completed", false);
			oquery.equalTo("failed", false);
			oquery.find({
				success:function(findings){
					findings.sort(function(x, y){
					    return x.index - y.index;
					});
					var data = findings[0].toJSON();
					var subtaskHtml = "";
		            for(var s = 0; s < data.subtasks.length; s++){
		           		subtaskHtml += "<li><input id='" + data.objectId + "_" + data.subtasks[s].id + "'  type='checkbox' class='subtask_check'" + ((data.subtasks[s].completed)? "checked" : "") + "/>"
		           					+ "<label for='"+ data.objectId + "_" + data.subtasks[s].id + "'>" + data.subtasks[s].title + "</label></li>";
		           	}
		           	var date = dateString(new Date(mission.deadline.iso), true);
					var htmlBuilder =  "<div class='mission_background'>"
							+ "<li class='mission_box container current_mission' id='" + mission.objectId +"'>"
							+ 	"<div class='pull-right btn-group mdropdown'>"
							+	 	"<a class='mdropdown-toggle' href='#' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>"
	            			+ 		"<span class='glyphicon glyphicon-chevron-down'></span>"
	            			+ 		"<span class='sr-only'>Menu</span>	</a>"
            				+ 		"<ul class='dropdown-menu mission-dropdown' aria-labelledby='dropdownMenu4'>"
							+ 				"<li><a class='editl_mission' id='edit_" + data.objectId + "'>Edit</a></li>"
							+ 				"<li><a class='cancel_mission' id='cancel_" + data.objectId + "'>Delete</a></li>"
							+			"</ul></div>"
							+		 "<div class='runner-progress'>"
							+			"<br/><div class='progress_background'>"
							+				"<div id='distance_" + mission.objectId + "' class='distance'></div>"
	            			+  			"<img src='" + "/images/deadlion_leap.png" +"' class='progress_img lion_img' id='lion_" + mission.objectId + "'/>"	
	            			+			"<img src='/images/" + mission.runner + "_panic_static.png' class='progress_img runner_img pull-right' id='runner_" + mission.objectId + "'/>"
            				+		"</div>"
            				+	"</div>"
            				+	"<h4 class='pull-right mission_dates'>" + ((mission.dates)? "Every " + mission.dates  + "<br/>Until: " + data.title + " at " + date.split(" ")[date.split(" ").length -1]: "Due: " + date) + "</h4>"
							+ 	"<h3 class='subtaskToggle' id='mission_" + mission.objectId + "'>" + mission.title + "&nbsp;"
	            			+		"<span id='collapse_indicator' class='collapsed glyphicon glyphicon-chevron-up'></span>"
	            			+	"</h3>"
	            			+	"<div class='tasklist' id='" + data.objectId + "'>"
	            			+		"<ul class='list-unstyled subtasks-list'>" + subtaskHtml + "</ul>"
	            			+	"</div>"
	            			+	"<a class='btn pull-right complete_mission btn-custom' id='complete_" + data.objectId + "'>Incomplete</a>"
	            			+ "</li></div>";
            		$("#missions-list").append(htmlBuilder);

            		$("#mission_"+ mission.objectId).click(toggleSubtaskList);
            		$("#" + data.objectId).data("parseObject", findings[0]);
            		$("#" + mission.objectId).data("mission", result);
            		var target = new Date(mission.deadline.iso);
		    		$("#lion_" + mission.objectId).css("margin-left", Math.min(80, (1- ((target - new Date()) / (target - new Date(data.createdAt)))) * 80)  + "%");
		    		$("#distance_" + mission.objectId).css("width", Math.min(100, (1- ((target - new Date()) / (target - new Date(data.createdAt)))) * 100)  + "%");

            		checkForCompleted(data);
            	
            		$("#cancel_" + data.objectId).click(cancelMission);
					$("#" + data.objectId + " .subtask_check").change(checkSubtask);
					$("#complete_" + data.objectId).click(completeMission);

            		return promise;
		        }
		    });
		});
		console.log("finished");
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
	console.log(to_update);
	var list = to_update.get("subtasks");
	list[index].completed = $("#" + event.target.id).is(":checked");

	to_update.set({
		"subtasks": list
	});
	to_update.save({
		success:function(){
			checkForCompleted(to_update.toJSON());
		}
	});
}

function checkForCompleted(data){
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
   	$("#complete_" + data.objectId).text((readyToComplete)? "Click to Complete!" : "Incomplete");
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
	var runner =$("#" + to_complete.get("missionId")).data("mission").get("runner");
	console.log(runner);
	window.localStorage.setItem("runner", runner);
	console.log("task", to_complete);
	var now = new Date();
	//to_complete.set("completed", true);
	to_complete.save({
		success:function(){
			window.location = "/mission_complete";
		}
	})
}
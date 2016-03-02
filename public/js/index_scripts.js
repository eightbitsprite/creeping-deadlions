'use strict';

var queue = [];


$(document).ready(function() {
	Parse.initialize("YXlPjDOZPGg2dnC4z2XBGHk5xg8jirJVclFEMTmo", "IWqi5XWUalPKb9uXMX8WCkFNaEuyrIxTzOeH9tPH");
	console.log("user",JSON.parse(window.localStorage.getItem("current_user")));
	if(JSON.parse(window.localStorage.getItem("current_user")) == null){
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

		$("#next_button").click(nextPage);		
		$("#back_button").click(previousPage);
		$(".close_editmission").click(previousPage);
		$(".btn-add-time").click(addTime);
		$(".btn-fail-mission").click(failMission);
		renderMissions();
		renderCompleted();
		//renderFailed();
		

		/*setInterval(function() {
		    calculateDistances();
		}, 30 * 1000); // 60 * 1000 milsec*/
	}
})

function calculateDistances(){
 	/*console.log("calculating distances...");
	var list = $(".current_mission");
    $.each(list, function(){
    	var mission = $(this).data("mission").toJSON();
    	var objective = $(this).find(".tasklist").data("parseObject").toJSON();
    	if(!mission.completed){
    		var target = new Date(mission.deadline.iso);
    		var created = new Date(objective.createdAt);
    		if(new Date() <= target){
    			$("#lion_" + mission.objectId).css("margin-left", ((1- ((target - new Date()) / (target - created))) * 80) + "%");	
    			$("#distance_" + mission.objectId).css("width", Math.min(100, (1- ((target - new Date()) / (target - created))) * 100)  + "%");
    		}else{
    			var index = -1;
    			for(var i = 0; i < queue.length; ++i){
    				console.log(queue[i].objective);
    				if(queue[i]["objective"] == objective.objectId){
    					index = i;
    				}
    			}
    			if(index < 0){
    				$(".mission_title").text(mission.title);
    				$(".failed_dialog").data("objective", objective.objectId);
    				$(".failed_dialog").modal({"show":true});
    			}else{
    				var retrieved = queue[index];
    				retrieved.pass ++;
    				if(retrieved.pass >= 2){
    					//queue.remove(index);
    					$(".timeup_dialog").modal("show");
    					//failMission();
    				}else{
    					queue[index] = retrieved;	
    				}
    				
    			}
    		}
    	}
    });*/
}
function addTime(){
	console.log("Adding time...");
	console.log($(".failed_dialog").data("objective"));
	queue.push({"pass" : 0 , "objective" : $(".failed_dialog").data("objective")});
	$(".failed_dialog").modal("hide");
}

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

	renderVillage();
}
function showHelp() {
	$("#missions").css("display","none");
	$("#history").css("display","none");
	$("#village").css("display","none");
	$("#help").css("display","block");
	$("#current_page_id").empty().append("Help");
}

function renderVillage() { 
	console.log("rendering village");
	$.get("/vInfo",getVillageLevel);

}
function getVillageLevel(vInfo) {
	//console.log("getVillageLevel() ");
	//console.log(vInfo);
	var username = JSON.parse(window.localStorage.getItem("current_user")).username;
	var userObject = Parse.Object.extend("User");
	//var ObjectiveObject = Parse.Object.extend("Objective");
	var query = new Parse.Query(userObject);
	query.equalTo("username", username);
	query.greaterThanOrEqualTo("villageLevel", 0);
	query.find({
		success:function(findings) {
			//console.log(findings);
			if (!findings.length) {
				console.log("That's strange. Something should be happening.");
				return;
			}
			var village = vInfo.villageReqs[findings[0].get("villageLevel")];
			$("#village_display").html("<div><img src='"+village.image+"'></div>");
			var oquery = new Parse.Query(Parse.Object.extend("hasObtained"));
			/*"user" should have search key for user ID */
			oquery.equalTo("user", username);
			oquery.find({
				success:function(rfindings) {
					//console.log(rfindings);
					if(!rfindings.length) {
						//console.log("No resource information found for "+username+". Seek help.");
						return;
					}
					for (var i = 0; i<rfindings.length; i++) {
						//console.log("Village: " + village.req_wood);
						var resourceType = rfindings[i].get("resourceType");
						var resourceAmt = rfindings[i].get("quantity");
						switch (resourceType) {
							case "wood":
								$(".resource_wood").empty().append(resourceAmt+"/"+village.req_wood);
								break;
							case "food":
								$(".resource_food").empty().append(resourceAmt+"/"+village.req_food);
								break;
							case "stone":
								$(".resource_stone").empty().append(resourceAmt+"/"+village.req_stone);
								break;
							default:
								console.log("ERROR: resourceType or resourceAmt search failure");
						}
					}
				},
				error:function(rfindings){
					console.log("No resource information found for "+username+". Seek help.");
				}
			});
		}
	});
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
		    return x.deadline - y.deadline;
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
					if(!findings[0]) { //Means have finished all objectives associated with mission
						//alert("Error: Empty mission found! \n You may need to create a new account.");
						return;
					}
					console.log(findings[0]);
					var data = findings[0];
					var subtaskHtml = "";
		            for(var s = 0; s < data.get("subtasks").length; s++){
		           		subtaskHtml += "<li><input id='" + data.id + "_" + data.get("subtasks")[s].id + "'  type='checkbox' class='subtask_check'" + ((data.get("subtasks")[s].completed)? "checked" : "") + "/>"
		           					+ "<label for='"+ data.id + "_" + data.get("subtasks")[s].id + "'>" + data.get("subtasks")[s].title + "</label></li>";
		           	}
		           	var date = dateString(new Date(mission.deadline.iso), true);
		           console.log("#edit_"+ data.id);
					var htmlBuilder =  "<div class='mission_background'>"
							+ "<li class='mission_box container current_mission' id='" + mission.objectId +"'>"
							+ 	"<div class='pull-right btn-group mdropdown'>"
   							+	"<a class='btn dropdown-toggle mission_dropdown' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>"
     						+ 		"<span class='glyphicon glyphicon-chevron-down'></span></a>"
     						+ 		"<ul class='dropdown-menu mission_options'>"
   							+ 			"<li><a class='edit_mission' id='edit_" + data.id + "'>Edit</a></li>"
							+ 			"<li><a class='cancel_mission' id='cancel_" + data.id + "'>Delete</a></li>"
    						+		"</ul>"
							+	"</div>"
							+	"<div class='runner-progress'>"
							+		"<br/><div class='progress_background'><div class='pBar_r'>&nbsp;</div>"
							+			"<div id='distance_" + mission.objectId + "' class='distance'></div>"
	            			+  		"<img src='" + "/images/deadlion_leap.png" +"' class='progress_img lion_img' id='lion_" + mission.objectId + "'/>"	
	            			+		"<img src='/images/" + mission.runner + "_panic_static.png' class='progress_img runner_img pull-right' id='runner_" + mission.objectId + "'/>"
            				+	"</div>"
            				+	"<h4 class='mission_dates'><img src='/images/icon_timed.png' class='time_img'/>&nbsp;Due: " + dateString(data.get("deadline"), true) + "</h4>"
							+ 	"<h3 class='subtaskToggle' id='mission_" + mission.objectId + "'>" + mission.title + "&nbsp;"
	            			+		"<span class='collapse_indicator collapsed glyphicon glyphicon-chevron-up'></span>"
	            			+	"</h3>"
	            			+	"<div class='tasklist' id='" + data.id + "'>"
	            			+		((mission.dates) ? "<h4 class='mission_dates'>Every " + mission.dates  + "<br/>Until: " + dateString(new Date(mission.deadline.iso), false) + "</h4>" : "")
	            			+		"<ul class='list-unstyled subtasks-list'>" + subtaskHtml + "</ul>"
	            			+	"</div>"
	            			+	"<a class='btn pull-right complete_mission btn-custom' id='complete_" + data.id + "'>Incomplete</a>"
	            			+ "</li>"
	            			+ "</div>";
            		$("#missions-list").append(htmlBuilder);

            		$("#mission_"+ mission.objectId).click(toggleSubtaskList);
            		console.log($("#edit_"+ data.id));
            		$("#edit_"+ data.id).click(editMission);

            		$("#" + data.id).data("parseObject", findings[0]);
            		$("#" + mission.objectId).data("mission", result);
            		var target = new Date(mission.deadline.iso);
		    		$("#lion_" + mission.objectId).css("margin-left", Math.min(80, (1- ((target - new Date()) / (target - new Date(data.get("createdAt"))))) * 80)  + "%");
		    		$("#distance_" + mission.objectId).css("width", Math.min(100, (1- ((target - new Date()) / (target - new Date(data.get("createdAt"))))) * 100)  + "%");

            		checkForCompleted(data);
            	
            		$("#cancel_" + data.id).click(cancelMission);
					$("#" + data.id + " .subtask_check").change(checkSubtask);

            		return promise;
		        }
		    }).then(function(){
			calculateDistances();
		});
		});
	});
}

function renderCompleted(){
	var username = JSON.parse(window.localStorage.getItem("current_user")).username;
	var MissionObject = Parse.Object.extend("Mission");
	var query = new Parse.Query(MissionObject);
	query.equalTo("user", username);
	query.equalTo("completed", true);
	console.log("rendering completed");
	query.find().then(function(results){
    	if(results.length == 0){
    		 $("#completed-missions-list").html("<li class='default-list'><em>No missions to display. <br/>"
    		 	+ "Click <strong>'New Mission'</strong> to create a new mission.</em></li>");
    	}else{
    		var htmlBuilder = "";
    		console.log("results", results);
	        for (var i = 0; i < results.length; i++) {
	            var data = results[i].toJSON();
	           	var updatedDate = new Date(data.updatedAt);
	           	var endDate = updatedDate.toLocaleDateString();
	           	var endTime = updatedDate.toLocaleTimeString();
	           	endTime = endTime.split(":");
	           	var am_pm = endTime[2].split(" ");
	           	endTime = endTime[0] + ":" + endTime[1] + " " + am_pm[1];
	            htmlBuilder += "<li class='mission_box container history_mission' id='" + data.objectId+"'>"
            					+ "<ul class='list-inline subtaskToggle'>"
	            				+	"<li><h3 class='subtaskToggle'>" + data.title + "</h3></li>"
	            				+ 	"<li><span class='collapse_indicator collapsed glyphicon glyphicon-chevron-up'>"
	            				+ 		"</span></li>"
	            				+	"<li class=''><h5>Ended " + endTime + ", " +	endDate + "</h5></li>"
	            				+ "</ul>"
	            				+ "<div class='stat-bar progress' style='clear:both'>"
								+	  "<div class='progress-bar progress-bar-success' style='width: " 
								+ 			(data.completedTasks/data.totalTasks * 100) + "%'>" 
								+ 			(data.completedTasks/data.totalTasks * 100) + "%</div>"
								+	  "<div class='progress-bar progress-bar-warning progress-bar-striped' style='width:" 
								+ 			(data.failedTasks/data.totalTasks * 100) + "%'>" 
								+ 			(data.failedTasks/data.totalTasks * 100) + "%</div>"
								+ 	"</div>"
								+	"<div class='history_dropdown tasklist'>"
	            				+	"<h5>Completed " + data.completedTasks + " out of "+ data.totalTasks + " subtasks</h5>"
	            				+	"<h6><em>Started at: " + dateString(new Date(data.createdAt), true) + "</em></h6>"
	            				+ 	"<p>Time Elapsed: " + getTimeDifference(new Date(data.createdAt), new Date(data.updatedAt)) + "</p>"
	            				+	"</div>"
	            				+ "</li>"
	        }
	        $("#completed-missions-list").html(htmlBuilder);
      		$(".subtaskToggle").click(toggleSubtaskList);
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
		"subtasks": list,
	});
	to_update.save({
		success:function(){
			checkForCompleted(to_update);
		}
	});
}

function checkForCompleted(data){
	var readyToComplete = $("#" + data.id).find(":checked").length == data.get("subtasks").length;
     if(readyToComplete){
     	$("#complete_" + data.id).addClass("btn-success");
     	$("#complete_" + data.id).removeClass("btn-secondary-outline");
     	$("#complete_" + data.id).click(completeMission);
     }else{
     	$("#complete_" + data.id).removeClass("btn-success");
     	$("#complete_" + data.id).addClass("btn-secondary-outline");
     	$("#complete_" + data.id).off("click");
     }

    $("#complete_" + data.id).prop("disable", !readyToComplete);
   	$("#complete_" + data.id).css("cursor", (readyToComplete)? "pointer" : "not-allowed");
   	$("#complete_" + data.id).text((readyToComplete)? "Click to Complete!" : "Incomplete");
   	return readyToComplete;
}

/* Collapses/Expands the subtasklist for the current mission*/
function toggleSubtaskList(event){
	//debugger;
	var currentBox = $(this).parent();
	var currentList = currentBox.children(".tasklist");

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

function editMission(event) {
	debugger;
	var editMission_modal = $(".editmission_modal");
	var dataId = event.target.id.split("_")[1];
	var dataObject = $("#"+dataId).data("parseObject");
	//console.log(dataObject);
	var missionId = dataObject.get("missionId");

	var missionObject = $("#"+missionId).data("mission");
	var missionName = missionObject.get("title");
	var missionDate = missionObject.get("deadline");
	//console.log("Title: "+missionName);

	editMission_modal.removeAttr("id");
	editMission_modal.attr("id", missionId);
	editMission_modal.find("#editmission_modaltitle").empty().append(missionName);

	$("#new_mission_name_textbox").empty().val(missionName);
	$("#new_task_due_date").empty().val(missionDate.toLocaleDateString());
	$("#new_task_due_time").empty().val(missionDate.toLocaleTimeString());

	/*display modal*/
	editMission_modal.modal({"show":true});
}
/* Barebones implementation, just flashes to the next part of popup*/	
function nextPage(event) {
	$("#frequency").css("display", "none");
	$("#objectives").css("display", "block");	
}
function previousPage(event) {
	$("#frequency").css("display", "block");
	$("#objectives").css("display", "none");	
}

function completeMission(event){
	var to_complete = $("#" + event.target.id.split("_")[1]).data("parseObject");
	var mission =$("#" + to_complete.get("missionId")).data("mission");
	window.localStorage.setItem("runner", mission.get("runner"));
	console.log("task", to_complete);
	var now = new Date();
	mission.set({
		"completed" :  (mission.get("completedTasks") + 1 + mission.get("failedTasks")) == mission.get("totalTasks"),
		"completedTasks": mission.get("completedTasks") + 1
	});
	//if(mission.get("completedTasks") == mission.get("totalTasks"))
	//true- set alert, not animation; false set animation then alert
	mission.save({
		success:function(){
			to_complete.destroy({
				success:function(){
					window.location = "/mission_complete";
				}
			});
		}
	});
	/**/
}

function failMission(){
	console.log("failing mission");
/*
	var to_fail = $("#" + event.target.id.split("_")[1]).data("parseObject");
	var mission =$("#" + to_complete.get("missionId")).data("mission");
	window.localStorage.setItem("runner", mission.get("runner"));
	console.log("task", to_complete);
	var now = new Date();
	mission.set({
		"completed" :  (mission.get("completedTasks") + 1 + mission.get("failedTasks")) == mission.get("totalTasks"),
		"completedTasks": mission.get("completedTasks") + 1
	});
	//if(mission.get("completedTasks") == mission.get("totalTasks"))
	//true- set alert, not animation; false set animation then alert
	mission.save({
		success:function(){
			to_complete.destroy({
				success:function(){
					window.location = "/mission_complete";
				}
			});
		}
	});
	/**/
}

function editMission(event) {
	console.log("called");
	//debugger;
	var editMission_modal = $(".editmission_modal");
	var dataId = event.target.id.split("_")[1];
	var dataObject = $("#"+dataId).data("parseObject");
	//console.log(dataObject);
	var missionId = dataObject.get("missionId");

	var missionObject = $("#"+missionId).data("mission");
	var missionName = missionObject.get("title");
	var missionDate = missionObject.get("deadline");
	//console.log("Title: "+missionName);

	editMission_modal.removeAttr("id");
	editMission_modal.attr("id", missionId);
	editMission_modal.find("#editmission_modaltitle").empty().append(missionName);

	$("#new_mission_name_textbox").empty().val(missionName);
	$("#new_task_due_date").empty().val(missionDate.toLocaleDateString());
	$("#new_task_due_time").empty().val(missionDate.toLocaleTimeString());

	/*display modal*/
	editMission_modal.modal({"show":true});
}
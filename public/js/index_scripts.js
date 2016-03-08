'use strict';

var queue = [];
var subtaskIndex = 0;

$(document).ready(function() {
	Parse.initialize("YXlPjDOZPGg2dnC4z2XBGHk5xg8jirJVclFEMTmo", "IWqi5XWUalPKb9uXMX8WCkFNaEuyrIxTzOeH9tPH");
	if(!Parse.User.current()){
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
		$("#username_input").val(Parse.User.current().getUsername());

		$( "#new_task_due_date" ).datepicker();
		$(".btn-add-time").click(addTime);
		$(".btn-fail-mission").click(failMission);
		$(".close_modal").click(closeModal);
		$(".cancelDelete").click(closeDelete);
		$(".cancel_one").click(deleteOne);
		$(".cancel_all").click(deleteAll);
		$("#cancel_progress").css("display", "none");
		$(".save_objective_changes").click(saveObjectiveChanges);
		$("#new_subtask_textbox").keydown(function(event){
			if(event.keyCode == 13){
				addSubtask();
			}
		});
		$("#add_task_button").click(addSubtask);
		renderMissions();
		renderCompleted();		
		updateResourceCount();
		queue = [];

		setInterval(function() {
		    calculateDistances();
		}, 30 * 1000); // 60 * 1000 milsec*/
	}
	$.get("/vInfo",getVillageLevel);
})
function saveObjectiveChanges(){
	var objective = $(".editmission_modal").data("objective");
	var mission = $("#" + objective.get("missionId")).data("mission");
	var deadline;

	var title = $("#new_mission_name_textbox").val().trim();
	
	var isValid = true;
	$("#error_msg").html("");

	if(title.trim() == ""){
		$("#error_msg").append("<p>Mission name is required.</p>");
		isValid = false;
	}
	if($("#new_task_due_date").val().trim() == ""){
		$("#error_msg").append("<p>Please select a valid due date.</p>");
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

	if($("#new_subtasks_index").find(".subtask_edit").length == 0){
		$("#error_msg").append("<p>Please enter at least one objective.</p>");
     	isValid = false;
	}


	if(isValid){
		var list = $("#new_subtasks_index").find(".subtask_name");
		var subtaskList = [];
		for(var i = 0; i < list.length; i++){
			console.log("editing", list[i]);
			subtaskList.push({
				"title": $(list[i]).text().trim(),
				"id" : i,
				"completed" : false
			});
		}
		console.log("editing", objective);
		objective.save({
			subtasks: subtaskList
		},{
			success:function(){
				mission.save({
					title: title,
					deadline: (mission.get("totalTasks") == 1)?  deadline : mission.get("deadline")
				}, {
					success:function(){
						$(".editmission_modal").modal("hide");
						renderMissions();
					}
				})
			}
		})		
	}
}
function gAnalytic_newMission(){
	ga("send", "event", "button: New Mission", "/create_mission");
}
function calculateDistances(){
 	console.log("calculating distances...");
	var list = $(".current_mission");
	
	if(!($(".failing").data('bs.modal') || {}).isShown){
	    $.each(list, function(){
	    	
	    	var mission = $(this).data("mission").toJSON();
	    	var objective = $(this).find(".tasklist").data("parseObject").toJSON();
	    	if(!mission.completed &&  $("#" + objective.objectId).find(":checked").length != objective.subtasks.length){
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
	    					$(".failed_dialog").data("objective", objective.objectId);
	    					$(".timeup_dialog").modal("show");
	    					//failMission();
	    				}else{
	    					queue[index] = retrieved;	
	    				}
	    				
	    			}
	    		}
	    	}
	    });
	}

}
function addTime(){
	console.log("Adding time...");
	console.log($(".failed_dialog").data("objective"));
	queue.push({"pass" : 0 , "objective" : $(".failed_dialog").data("objective")});
	$(".failed_dialog").modal("hide");
}

function logOut() {
	//window.localStorage.setItem("current_user", null);
	Parse.User.logOut();
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
	var username = 	Parse.User.current().get("username");
	var userid = Parse.User.current().id;
	var userObject = Parse.Object.extend("User");
	$("#btn-upgrade").off( "click");
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
			console.log("village",village);

			$("#village_display").html("<img class='vimg' src='"+village.image+"'>");
			$("#village_namelvl").html("<strong>Lvl. "+findings[0].get("villageLevel")+"</strong>");
			$(".village_dropdown").html("Village Level: "+findings[0].get("villageLevel"));

			var oquery = new Parse.Query(Parse.Object.extend("hasObtained"));
			/*"user" should have search key for user ID */
			oquery.equalTo("user", userid);
			oquery.find({
				success:function(rfindings) {
					//console.log(rfindings);
					if(!rfindings.length) {
						//console.log("No resource information found for "+username+". Seek help.");
						return;
					}
					var enoughWood = false;
					var enoughStone = false;
					var enoughFood = false;
					for (var i = 0; i<rfindings.length; i++) {
						//console.log("Village: " + village.req_wood);
						var resourceType = rfindings[i].get("resourceType");
						var resourceAmt = rfindings[i].get("quantity");
						
						switch (resourceType) {
							case "wood":
								$(".resource_wood").empty().append(resourceAmt+"/"+village.req_wood);
								enoughWood = (resourceAmt >= village.req_wood);
								break;
							case "food":
								$(".resource_food").empty().append(resourceAmt+"/"+village.req_food);
								enoughFood = (resourceAmt >= village.req_food);
								break;
							case "stone":
								$(".resource_stone").empty().append(resourceAmt+"/"+village.req_stone);
								enoughStone = (resourceAmt >= village.req_stone);
								break;
							default:
								console.log("ERROR: resourceType or resourceAmt search failure");
						}
					}
					console.log("Upgrade possible: " + (enoughStone && enoughFood && enoughWood));
					if(enoughStone && enoughFood && enoughWood){
						$("#btn-upgrade").addClass("btn-upgrade-enable");
						$("#btn-upgrade").removeClass("btn-upgrade-disable");
						$("#btn-upgrade").prop("disabled", false);
						$("#btn-upgrade").click(function(){
							upgradeVillage(village, userid);
						});
					}else{
						$("#btn-upgrade").addClass("btn-upgrade-disable");
						$("#btn-upgrade").removeClass("btn-upgrade-enable");
						$("#btn-upgrade").prop("disabled", true);
					}
				},
				error:function(rfindings){
					console.log("No resource information found for "+username+". Seek help.");
				}
			});
		}
	});
}

function upgradeVillage(village, userid){
	console.log("called");
	var user= Parse.User.current();
	var oquery = new Parse.Query(Parse.Object.extend("hasObtained"));
	var nextLevel = user.get("villageLevel") + 1;
	console.log("next level is", nextLevel);
	user.save({villageLevel : nextLevel}, {
		success:function(){
			oquery.equalTo("user", userid);
			oquery.find().then(function(results){
				console.log(results);
				var wood = null;
				var stone = null;
				var food = null;
				results.forEach(function(entry){
					switch (entry.get("resourceType")){
						case "wood":
							wood = entry;
							break;
						case "food":
							food = entry;
							break;
						case "stone":
							stone=entry;
							break;
					}
				});
				wood.set({quantity:wood.get("quantity") - village.req_wood});
				wood.save().then(function(){
					stone.set({quantity:stone.get("quantity") - village.req_stone});
					stone.save().then(function(){
						food.set({quantity:food.get("quantity") - village.req_food});
						food.save().then(function(){
							renderVillage();
						});
					});
				});
			});
		}		
	});
}

/* Renders the mission log from Parse database
	args: 	*/
function renderMissions(){
	console.log("rendering missions");
	$("#missions-list").html("");
	var username = Parse.User.current().get("username");
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
		    return x.get("deadline") - y.get("deadline") ;
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
	var username = Parse.User.current().get("username");
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
								+	  "<div class='progress-bar progress-bar-danger' style='width:" 
								+ 			(data.failedTasks/data.totalTasks * 100) + "%'>" 
								+ 			(data.failedTasks/data.totalTasks * 100) + "%</div>"
								+ 	"</div>"
								+	"<div class='history_dropdown tasklist'>"
								+	"<p><img src='/images/"+ data.runner +"_happy_static.png' class='history_runner_img'/> Runner: "+ data.runnerName +"</p>" 
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
	var mission = $("#" + to_delete.get("missionId")).data("mission");
	var occurrences = mission.get("totalTasks") - (mission.get("completedTasks") + mission.get("failedTasks"));
	$("#mission_occurrence").html(occurrences);
	$(".cancel_mission_title").html(mission.get("title"));
	$("#multiple_delete").css("display", (occurrences > 1)? "block" : "none");
	$("#single_delete").css("display", (occurrences > 1)? "none" : "block");
	$(".cancel_modal").modal("show");
	window.localStorage.setItem("to_delete", to_delete.id);
}

function deleteOne(){
	var to_delete = $("#" + window.localStorage.getItem("to_delete")).data("parseObject");
	var mission = $("#" + to_delete.get("missionId")).data("mission");
	to_delete.destroy({
    	success: function(){
    		if(mission.get("totalTasks") - 1 == 0){
				mission.destroy({
	    			success:function(){
	    				renderMissions();
	    				closeDelete();
	    			}
	    		});
			}else{
				mission.set({
					totalTasks: mission.get("totalTasks") -1,
					completed : mission.get("totalTasks") -1 == mission.get("completedTasks") + mission.get("failedTasks")
				});

				mission.save({
					success:function(){
						renderMissions();
	    				closeDelete();
					}
				});
		}
    	}
    });	
}

function deleteAll(){
	var to_delete = $("#" + window.localStorage.getItem("to_delete")).data("parseObject");
	var mission = $("#" + to_delete.get("missionId")).data("mission");
	var ObjectiveObject = Parse.Object.extend("Objective");
	var query = new Parse.Query(ObjectiveObject);
	query.equalTo("missionId", mission.id);
	query.find().then(function(results){
		var promise = Parse.Promise.as();
		var increment = 1/results.length * 100;
		$("#cancel_progress").css("display", "block");
 		_.each(results, function(objective) {
 			promise = promise.then(function(){
 				$("#cancel_progress .progress-bar").width(increment + "%");
	 			increment += 1/results.length * 100;
	 			console.log(increment + "%");
 				return objective.destroy();
 			});
 		});
 		return promise;
	}).then(function(){
		mission.destroy({
			success:function(){
				renderMissions();
				$("#cancel_progress").css("display", "none");
				closeDelete();
			}
		});
	});
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
	
	console.log("task", to_complete);
	var now = new Date();
	var completedEntireMission = (mission.get("completedTasks") + 1 + mission.get("failedTasks")) == mission.get("totalTasks");
	mission.set({
		"completed" :  completedEntireMission,
		"completedTasks": mission.get("completedTasks") + 1
	});
	//if(mission.get("completedTasks") == mission.get("totalTasks"))
	//true- set alert, not animation; false set animation then alert
	mission.save({
		success:function(){
			to_complete.destroy({
				success:function(){
					var userid = Parse.User.current().id;
					var ResourceObject = Parse.Object.extend("hasObtained");
					var query = new Parse.Query(ResourceObject);
					query.equalTo("user", userid);
					query.equalTo("resourceType", mission.get("resource"));
					query.first().then(function(result){
				    	result.set({quantity: result.get("quantity") + 1});
				    	result.save({
				    		success:function(){
				    			updateResourceCount();
				    			if(completedEntireMission){
									window.localStorage.setItem("runner", mission.get("runner"));
									window.localStorage.setItem("resource", mission.get("resource"));
									window.location = "/mission_complete";
								}else{
									$(".resource_earned_img").attr("src", "/images/resource_" + mission.get("resource") + ".png");
									$(".resource_earned").html("+1 " + mission.get("resource"));
									$(".resource_modal").modal("show");
								}
				    		}
				    	});
					});					
				}
			});
		}
	});
	/**/
}

function failMission(){
	console.log("failing mission", $(".failed_dialog").data("objective"));
	var objective = $("#" + $(".failed_dialog").data("objective")).data("parseObject");
	var mission = $("#" + objective.get("missionId")).data("mission");
	console.log(objective);
	window.localStorage.setItem("runner", mission.get("runner"));
	var now = new Date();
	mission.set({
		"completed" :  (mission.get("completedTasks") + 1 + mission.get("failedTasks")) == mission.get("totalTasks"),
		"failedTasks": mission.get("failedTasks") + 1
	});
	//if(mission.get("completedTasks") == mission.get("totalTasks"))
	//true- set alert, not animation; false set animation then alert
	mission.save({
		success:function(){
			objective.destroy({
				success:function(){
					window.location = "/mission_fail";
				}
			});
		}
	});
	/**/
}

function editMission(event) {
	console.log("called", event);
	//debugger;
	var editMission_modal = $(".editmission_modal");
	var dataId = event.target.id.split("_")[1];
	var dataObject = $("#"+dataId).data("parseObject");
	console.log("data is",dataObject);
	var missionId = dataObject.get("missionId");

	var missionObject = $("#"+missionId).data("mission");
	var missionName = missionObject.get("title");
	var missionDate = missionObject.get("deadline");
	//console.log("Title: "+missionName);

	editMission_modal.removeAttr("id");
	editMission_modal.attr("id", missionId);
	editMission_modal.find("#editmission_modaltitle").empty().append(missionName);
	editMission_modal.data("objective", dataObject);
	var current_mission_objectives = dataObject.get("subtasks");

	$("#new_mission_name_textbox").empty().val(missionName);
	$("#new_task_due_date").empty().val(missionDate.toLocaleDateString());
	//$("#new_task_due_date").css("display", (missionObject.get("totalTasks").length > 1)? "none" : "block");
	console.log("time", missionDate.toLocaleTimeString());
	$("#new_task_due_time").val(missionDate.toLocaleTimeString().replace(" PM", "").replace(" AM",""));
	$("#new_subtasks_index").html("");
	subtaskIndex = 0;
	dataObject.get("subtasks").forEach(function(entry){
		$("#new_subtasks_index").append("<li id='subtask_item_" + subtaskIndex + "'>"
									+ "<h4 class='subtask subtask_edit' for='check_" + subtaskIndex + "' id='subtask_" + subtaskIndex + "'>"
									+ 		"<span class='pull-right'>"
									+			"<span id='edit_" + subtaskIndex + "' class='edit_subtask subtask_glyphicon glyphicon glyphicon-pencil' aria-hidden='true'></span>"
									+			"<span id='delete_" + subtaskIndex + "' class='delete_subtask subtask_glyphicon glyphicon glyphicon-remove' aria-hidden='true'></span>"
									+		"</span>"
									+ 		"<span class='subtask_name' id='" + subtaskIndex + "'>" + entry.title + "</span>" 
									+ "</h4></li>");
		$("#new_subtask_textbox").val("");
		$("#edit_" + subtaskIndex).click(editSubtask);
		$("#delete_" + subtaskIndex).click(deleteSubtask);
	});

	/*display modal*/
	editMission_modal.modal({"show":true});
}

function addSubtask(){
	console.log("called");
	var subtask = $("#new_subtask_textbox").val();
	$("#subtask_error_msg").html("");
	if(subtask.trim()== ""){
		$("#subtask_error_msg").append("<p>Field cannot be blank</p>");
	}else{
		$("#subtask_prompt").css("display", "none");
		console.log($("#new_subtasks_index"));
		$("#new_subtasks_index").append("<li id='subtask_item_" + subtaskIndex + "'>"
									+ "<h4 class='subtask' for='check_" + subtaskIndex + "' id='subtask_" + subtaskIndex + "'>"
									+ 		"<span class='pull-right'>"
									+			"<span id='edit_" + subtaskIndex + "' class='edit_subtask subtask_glyphicon glyphicon glyphicon-pencil' aria-hidden='true'></span>"
									+			"<span id='delete_" + subtaskIndex + "' class='delete_subtask subtask_glyphicon glyphicon glyphicon-remove' aria-hidden='true'></span>"
									+		"</span>"
									+ 		"<span class='subtask_name'>" + subtask + "</span>" 
									+ "</h4></li>");
		$("#new_subtask_textbox").val("");
		$("#edit_" + subtaskIndex).click(editSubtask);
		$("#delete_" + subtaskIndex).click(deleteSubtask);
		subtaskIndex++;
	}
}


function editSubtask(event){
	event.preventDefault();
	event.stopPropagation();
	var el = event.target.parentNode.parentNode;
	var title = $("#" + el.id).find(".subtask_name").text().trim();
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
	$("#edit_" + index).click(editSubtask);
	$("#delete_" + index).click(deleteSubtask);
	$("#subtask_" + index).data("data", title);
}


function closeModal(){
	$(".resource_modal").modal("hide");
	renderMissions();
}

function closeDelete(){
	$(".cancel_modal").modal("hide");
}

function updateResourceCount(){
	var userid = Parse.User.current().id;
	var ResourceObject = Parse.Object.extend("hasObtained");
	var query = new Parse.Query(ResourceObject);
	query.equalTo("user", userid);
	query.find().then(function(results){
		results.forEach(function(entry){
			$("." + entry.get("resourceType") + "_count").html(entry.get("quantity"));
		});
	});
}
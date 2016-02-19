'use strict';

$(document).ready(function() {
	initializePage();
})

function initializePage() {
	if(!window.localStorage.getItem("current_user")){
		console.log("not logged in");
		location.replace("/login#sign-in");
	}
	$("#menu_log").click(showLog);
	$("#menu_history").click(showHistory);
	$("#menu_help").click(showHelp);
	$("#menu_village").click(showVillage);
} 

function showLog() {
	$("#missions").css("display","block");
	$("#history").css("display","none")
	$("#village").css("display","none")
	$("#help").css("display","none")
}
function showHistory() {
	$("#missions").css("display","none")
	$("#history").css("display","block")
	$("#village").css("display","none")
	$("#help").css("display","none")
}
function showVillage() {
	$("#missions").css("display","none")
	$("#history").css("display","none")
	$("#village").css("display","block")
	$("#help").css("display","none")
}
function showHelp() {
	$("#missions").css("display","none")
	$("#history").css("display","none")
	$("#village").css("display","none")
	$("#help").css("display","block")
}
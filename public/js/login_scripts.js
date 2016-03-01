'use strict';

$(document).ready(function() {
	initializePage();
	Parse.initialize("YXlPjDOZPGg2dnC4z2XBGHk5xg8jirJVclFEMTmo", "IWqi5XWUalPKb9uXMX8WCkFNaEuyrIxTzOeH9tPH");
})

function initializePage() {
	$("#sign_up_button").click(function(event){
		var password = $("#new_password").val().trim();
		var username = $("#new_username").val().trim();
		if(password == "" || username == ""){
			event.preventDefault();
			event.stopPropagation();
			$("#error_msg").html("Username and Password cannot be left blank.");
		} else if($("#new_password").val() != $("#new_password_verify").val()){
			event.preventDefault();
			event.stopPropagation();
			$("#error_msg").html("Passwords do not match.");
		} else{
			var UserObject = Parse.Object.extend("User");
			var ObtainedObject = Parse.Object.extend("hasObtained");
			var query = new Parse.Query(UserObject);
			query.equalTo("username", username);
			query.find({
			  success: function(results) {
			  	if(results.length == 0){
			  		$("#error_msg").html("");
					var user = new UserObject();
					var wood = new ObtainedObject();
					var stone = new ObtainedObject();
					var food = new ObtainedObject();
					console.log("REACHED");
					user.save({
						username: username,
						password: password,
						villageLevel:0,
						finishedTutorial:false
					}, {
						success:function(){
							window.localStorage.setItem("current_user", JSON.stringify(user));
							wood.save({
								resourceType: "wood",
								quantity:0,
								user: user.id
							}).then(function(){
								stone.save({
									resourceType: "stone",
									quantity:0,
									user: user.id
								}).then(function(){
									food.save({
										resourceType: "food",
										quantity:0,
										user: user.id
									}).then(function(){
										window.location = "/";
									});
								});
							});
						}
					});
					
			  	}else{
			  		$("#error_msg").html("Username already taken.");

			  	}
			  },
			  error: function(error) {
			    alert("Error: " + error.code + " " + error.message);
			  }
			});
		}
	});
	$("#cancel_sign_up_button").click(function(event){
		$("#new_username").val("");
		$("#new_password").val("");
		$("#new_password_verify").val("");
		$("#password_error").css("display", "none");
	});

	$("#sign-in-button").click(function(event){
		var username = $("#username").val().trim();
		var password = $("#password").val().trim();
		var UserObject = Parse.Object.extend("User");
		Parse.User.logIn(username, password, {
	        // If the username and password matches
	        success: function(user) {
	            $("#error_msg").html("");
				window.localStorage.setItem("current_user", JSON.stringify(user));
				window.location = "/";
	        },
	        // If there is an error
	        error: function(user, error) {
			  	$("#error_msg").html("Invalid username or password.");
	        }
	    });
	});
	//$.get('/login_data', printData);
} 
function printData(result){
	console.log(result);
}
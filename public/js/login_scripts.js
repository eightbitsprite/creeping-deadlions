'use strict';

$(document).ready(function() {
	initializePage();
})

function initializePage() {
	$("#sign_up_button").click(function(event){
		if($("#new_password").val() != $("#new_password_verify").val()){
			event.preventDefault();
			event.stopPropagation();
			$("#password_error").css("display", "block");
		}else{
			$("#password_error").css("display", "none");
		}
	});
	$("#cancel_sign_up_button").click(function(event){
		$("#new_username").val("");
		$("#new_password").val("");
		$("#new_password_verify").val("");
		$("#password_error").css("display", "none");
	});

	$.get('/login_data', printData);
} 
function printData(result){
	console.log(result);
}
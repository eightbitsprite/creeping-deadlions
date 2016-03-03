function googleATimeCheck(event, time) {
	console.log("googleATimeCheck() running... TIME: " + time);
	if (event) {
		var endTime = time;
		var startTime = $("body").data("startTime");
		if (!startTime) {
			console.log("startDate NULL. google Analytics event failed");
		}
		var elapsedTime = endTime - startTime;
		elapsedTime = elapsedTime / (1000);
		console.log(elapsedTime);
		ga("send", "event", "saveTask()", "timeCheck", "", elapsedTime);
		return;
	} else {
		$("body").data("startTime", time);
	}
}
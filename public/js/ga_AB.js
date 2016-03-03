function googleATimeCheck(event, time) {
	console.log("googleATimeCheck() running... TIME: " + time);
	if (event) {
		var endTime = time;
		var startTime = $("body").data("startTime");
		if (!startTime) {
			console.log("startDate NULL. google Analytics event failed");
		}
		//debugger;
		var elapsedTime = endTime - startTime;
		elapsedTime = elapsedTime / (1000);
		console.log(elapsedTime);
		ga("send", {
			hitType: "event",
			eventCategory: "saveTask",
			eventAction: "timeCheck",
			eventValue: elapsedTime
		});
		return;
	} else {
		$("body").data("startTime", time);
	}
}
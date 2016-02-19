'use strict';

function filter(model_list, field, query) {
	var list = [];
	model_list.forEach(function(entry){
		if(entry[field] == query)
			list.push(entry);
	});
	return list;
} 

function data_contains(model_list, field, query){
	model_list.forEach(function(entry){
		if(entry[field] == query)
			return true;
	});
}

function dateString(date, includeTime){
	var stringBuilder = "";
	switch(date.getDay()){
		case 0:
			stringBuilder += "Sunday, ";
			break;
		case 1:
			stringBuilder += "Monday, ";
			break;
		case 2:
			stringBuilder += "Tuesday, ";
			break;
		case 3:
			stringBuilder += "Wednesday, ";
			break;
		case 4:
			stringBuilder += "Thursday, ";
			break;
		case 5:
			stringBuilder += "Friday, ";
			break;
		case 6:
			stringBuilder += "Saturday, ";
			break;
	}

	switch(date.getMonth()){
		case 0:
			stringBuilder += "January ";
			break;
		case 1:
			stringBuilder += "February ";
			break;
		case 2:
			stringBuilder += "March ";
			break;
		case 3:
			stringBuilder += "April ";
			break;
		case 4:
			stringBuilder += "May ";
			break;
		case 5:
			stringBuilder += "June ";
			break;
		case 6:
			stringBuilder += "July ";
			break;
		case 7:
			stringBuilder += "August ";
			break;
		case 8:
			stringBuilder += "September ";
			break;
		case 9:
			stringBuilder += "October ";
			break;
		case 10:
			stringBuilder += "November ";
			break;
		case 11:
			stringBuilder += "December ";
			break;
	}

	stringBuilder += date.getDate();
	switch(date.getDate()){
		case 1:
			stringBuilder += "st";
			break;
		case 1:
			stringBuilder += "nd";
			break;
		case 1:
			stringBuilder += "rd";
			break;
		default:
			stringBuilder += "th";
	}
	if(includeTime){
		stringBuilder += " at ";
		switch(date.getHours()){
			case 0:
			case 12:
				stringBuilder += "12";
				break;
			case 1:
			case 13:
				stringBuilder += "1";
				break;
			case 2:
			case 14:
				stringBuilder += "2";
				break;
			case 3:
			case 15:
				stringBuilder += "3";
				break;
			case 4:
			case 16:
				stringBuilder += "4";
				break;
			case 5:
			case 17:
				stringBuilder += "5";
				break;
			case 6:
			case 18:
				stringBuilder += "6";
				break;
			case 7:
			case 19:
				stringBuilder += "7";
				break;
			case 8:
			case 20:
				stringBuilder += "8";
				break;
			case 9:
			case 21:
				stringBuilder += "9";
				break;
			case 10:
			case 22:
				stringBuilder += "10";
				break;
			case 11:
			case 23:
				stringBuilder += "11";
				break;
			

		}
		stringBuilder += ":" + ((date.getMinutes() < 10)? "0" : "") + date.getMinutes() + ((date.getHours() >= 11)?"PM" : "AM");
	}
	return stringBuilder;
}

function getTimeDifference(start, end){
	var difference = end - start;
	var dayDiff = Math.floor(difference / (1000 * 3600 * 24)); 
	difference = difference - (dayDiff * 1000 * 3600 * 24);
	var hourDiff = Math.floor((difference) / (1000 * 3600)); 
	difference = difference - (hourDiff * 1000 * 3600);
	var minDiff = Math.floor(difference / (1000 * 60)); 

	return dayDiff + " days, " + hourDiff + " hours, and " + minDiff + " minutes";
}
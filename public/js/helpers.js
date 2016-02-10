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
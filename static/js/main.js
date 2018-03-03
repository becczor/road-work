queue()
    .defer(d3.csv,'static/data/data-small.csv')
    .defer(d3.json,'static/maps/Local_Authority_Districts_Dec_2016-topo.json')
    .await(draw);

var sp, map, bc;

// Counts all occurencies of values for a given property. Returns object with the values and its count.
function countOccurencies(data, prop) {
	var counted = {};
	data.forEach(function(d) {
		// https://stackoverflow.com/questions/18690814/javascript-object-increment-item-if-not-exist
		counted[d[prop]] = (counted[d[prop]] || 0) + 1;
	});
	return counted;
}

// Gets all unique values for a given property. Returns a list of all unique values.
function getOccurencies(data, prop) {
	var occ = [];
	data.forEach(function(d) {
		if !(occ.includes(d[prop])) {
			occ.push(d[prop]);
		}
	});
	return occ;
}

function setFormOptions(data, html) {
	var htmlString = "";
	var options = [];

	// Weather_Conditions
	options = getOccurencies(data, "Weather_Conditions");
	for (option in options) {
		htmlString += "<option value=" + option + ">" + option + "</option>\n";
	}
	document.getElementById("xx").innerHTML = htmlString;

	// Light_Conditions
	options = getOccurencies(data, "Light_Conditions");
	for (option in options) {
		htmlString += "<option value=" + option + ">" + option + "</option>\n";
	}
	document.getElementById("xx").innerHTML = htmlString;

	// Road_Surface_Conditions
	options = getOccurencies(data, "Road_Surface_Conditions");
	for (option in options) {
		htmlString += "<option value=" + option + ">" + option + "</option>\n";
	}
	document.getElementById("xx").innerHTML = htmlString;

	
}

$( document ).ready(function() {
	setFormOptions(data, html);


});


function draw(error, data, area_map_json){
    if (error) throw error;

    sp = new sp(data);
    map = new map(data, area_map_json);
    bc = new bc(data);

}
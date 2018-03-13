queue()
    .defer(d3.csv,'static/data/final_data.csv')
    .defer(d3.json,'static/maps/Local_Authority_Districts_Dec_2016-topo.json')
    .await(draw);

var sp, map, bc;

// Gets all unique values for a given property. Returns a list of all unique values.
function getOccurencies(data, prop) {
	var occ = [];
	//console.log(data);
	data.forEach(function(d) {
		if (!occ.includes(d[prop])) {
			occ.push(d[prop]);
		}
	});
	return occ;
}

function setFormOptions(data) {
	var htmlString = "";
	var options = [];
	
	// Weather_Conditions
	var options = getOccurencies(data, "Weather_Conditions");
	for (option in options) {
		htmlString += "<option value=\"'" + options[option] + "'\">" + options[option] + "</option>\n";
	}
	document.getElementById("sel_weather").innerHTML = htmlString;

	// Light_Conditions
	htmlString = "";
	options = getOccurencies(data, "Light_Conditions");
	for (option in options) {
		htmlString += "<option value=" + options[option] + ">" + options[option] + "</option>\n";
	}
	document.getElementById("sel_light").innerHTML = htmlString;

	// Road_Surface_Conditions
	htmlString = "";
	options = getOccurencies(data, "Road_Surface_Conditions");
	for (option in options) {
		htmlString += "<option value=" + options[option] + ">" + options[option] + "</option>\n";
	}
	document.getElementById("sel_road").innerHTML = htmlString;

/*	// Scatter Plot x
	htmlString = "";
	options = Object.keys(data[1]);
	for(option in options){
		htmlString += "<option value=" + options[option] + ">" + options[option] + "</option>\n";
	}
    document.getElementById("sel_x").innerHTML = htmlString;

	// Scatter Plot y
    htmlString = "";
    options = Object.keys(data[1]);
    for(option in options){
        htmlString += "<option value=" + options[option] + ">" + options[option] + "</option>\n";
    }
    document.getElementById("sel_y").innerHTML = htmlString;*/


}

function draw(error, data, area_map_json){
    if (error) throw error;

    setFormOptions(data);
    //configScatterFunc();

    sp = new sp(data);
    map = new map(data, area_map_json);
    bc = new bc(data);

}
/*
  Created: Jan 14 2018
  Author: Kahin Akram Hassan
*/
function map(data, area_map_json){

  this.data = data;
  this.area_map_json = area_map_json;

  var div = '#world-map';
  var parentWidth = $(div).parent().width();
  var margin = {top: 0, right: 0, bottom: 0, left: 0},
            width = parentWidth - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

  /*~~ Task 10  initialize color variable ~~*/
  var color = d3.scaleOrdinal(d3.schemeCategory20b);
  var cValue = function(d) { return d.Country;};

  //initialize zoom
  var zoom = d3.zoom()
    .scaleExtent([1, 10])
    .on('zoom', move);

  //initialize tooltip
  var tooltip = d3.select(div).append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);


  /*~~ Task 11  initialize projection and path variable ~~*/
  var projection = d3.geoMercator()
	  .scale(120)
	  .translate([width/2,height/2]);
	  
  var path = d3.geoPath()
	  .projection(projection);

  var svg = d3.select(div).append("svg")
      .attr("width", width)
      .attr("height", height)
      .call(zoom);

  var g = svg.append("g");
	
	console.log(area_map_json);
	
	// constructing map must be done using GEOjson instead of 
	// topojson like it is right now.
  var countries = topojson.feature(area_map_json,
        area_map_json.objects.collection).features;
	
	//console.log(area_map_json);

  var country = g.selectAll(".country").data(countries);
  console.log(country);

  /*~~ Task 12  initialize color array ~~*/
  var cc = [];
  //console.log(data);
  data.forEach(function(element, index, array) { cc[element.Country] = color(index); });

  country.enter().insert("path")
      .attr("class", "country")

        /*~~ Task 11  add path variable as attr d here. ~~*/
	  .attr("d", path)
      .attr("id", function(d) { return d.id; })
      .attr("title", function(d) { return d.properties.name; })
      .style("fill", function(d) { return cc[d.properties.name]; })
	  // QUESTION: What is properties? If we take i as index we get colors on the wrong countries.
	  //.style("fill", function(d,i) { return cc[i]; })
	  //.style("fill", function(d) { return color(cValue(d));})
	  //.style("fill", function(d) { return color(cValue(d.properties.name));})

      //tooltip
      .on("mousemove", function(d) {
        d3.select(this).style('stroke','white');

        tooltip.transition()
            .duration(200)
            .style("opacity", .9);
        var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); } );
        tooltip
        .attr("style", "left:"+(mouse[0]+30)+"px;top:"+(mouse[1]+30)+"px")
        .html(d.properties.name);
      })
      .on("mouseout",  function(d) {

          d3.select(this).style('stroke','none');
          tooltip.transition()
              .duration(500)
              .style("opacity", 0);
      })

      //selection
      .on("click",  function(d) {
		  //
		  var found = data.find(function(element) {
			return element.Country === d.properties.name;
		  });
		  sp.selectDots([found]);
          /*~~ call the other graphs method for selection here ~~*/
      });

  function move() {
      g.style("stroke-width", 1.5 / d3.event.transform.k + "px");
      g.attr("transform", d3.event.transform);
  }

    /*~~ Highlight countries when filtering in the other graphs~~*/
  this.selectCountry = function(value){

  }

}

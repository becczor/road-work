/*
  Created: Jan 14 2018
  Author: Kahin Akram Hassan
*/

function sp(data){

	console.log(data);
	
    this.data = data;
    var div = '#scatter-plot';
	
    var height = 500;
    var parentWidth = $(div).parent().width();
    var margin = {top: 20, right: 20, bottom: 60, left: 40},
        width = parentWidth - margin.right - margin.left,
        height = height - margin.top - margin.bottom;

    var color = d3.scaleOrdinal(d3.schemeCategory20);

    var tooltip = d3.select(div).append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // scale configuration
    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    /* Task 2
      Initialize 4 (x,y,country,circle-size)
      variables and assign different data attributes from the data filter
      Then use domain() and extent to scale the axes*/
	var xValue = 'Day_of_Week';
	var yValue = 'Speed_limit';
	var radius = 'Accident_Severity';

	
	/*x and y domain code here, based on values from data*/
	x.domain(d3.extent(data, function(d){return d[xValue];})).nice();
	y.domain(d3.extent(data, function(d){return d[yValue];})).nice();
	
	// QUESTION: How do we know that we can apply extent on data, since it is an object and not an array?
	// https://github.com/d3/d3-array/blob/master/README.md#extent
	
	// Define axes from scaled variables
	var xAxis = d3.axisBottom(x);
	var yAxis = d3.axisLeft(y);
	
	var cValue = function(d) { return d.Accident_Index;};
    var color = d3.scaleOrdinal(d3.schemeCategory20b);


    var svg = d3.select(div).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform","translate(" + margin.left + "," + margin.top + ")");

        /* ~~ Task 3 Add the x and y Axis and title  ~~ */
	   
	   svg.append("g")
		.attr("class", "axis")
		.attr("transform","translate(" + 0 + "," + height + ")")
		.call(xAxis);
		
		svg.append("text")
		.attr("class", "label")
		.attr("transform", "translate(" + (width/2) + " ," + (height + margin.top + 20) + ")")
		.style("text-anchor", "middle")
		.text("Day of week");
		
		svg.append("g")
		.attr("class", "axis")
		.call(yAxis);
		
		svg.append("text")
		.attr("class", "label")
		.style("text-anchor", "start")
		.text("Speed limit");

        /* ~~ Task 4 Add the scatter dots. ~~ */
		
		// The enter function creates placeholders for missing objects that we are about to create
		
		var circles = svg.selectAll("circles")
		.data(data)	
	
		.enter().append("circle")
		.attr("class", "circles")
		.attr("r", function(d){
			return d[radius]/10;
		})
		
		.attr("cx", function(d){
			return x(d[xValue]);}
		)
		.attr("cy", function(d){
			return y(d[yValue]);}
		)
		
		.style("fill", function(d) { return color(cValue(d));})
		
		/* ~~ Task 5 create the brush variable and call highlightBrushedCircles() ~~ */
		
		// Make circles non_brushed from beginning
		.attr("class", "non_brushed");
		
		// Create a 2D brush and set event listener (what is going to happen in case of an event)
		var brush = d3.brush()
			.on("brush", highlightBrushedCircles);
			
		
		// QUESTION: How can we apply the class brush to the svg?
		// Does it have to do with the fact that we call the brush afterwards?
		// What does the call function do exactly?
		svg.append("g")
			.attr("class", "brush")
			.call(brush);

         //highlightBrushedCircles function
         function highlightBrushedCircles() {
             if (d3.event.selection != null) {
                 // revert circles to initial style
                 circles.attr("class", "non_brushed");
                 var brush_coords = d3.brushSelection(this);
                 // style brushed circles
                   circles.filter(function (){
                            var cx = d3.select(this).attr("cx");
                            var cy = d3.select(this).attr("cy");
                            return isBrushed(brush_coords, cx, cy);
                  })
                  .attr("class", "brushed");
                   var d_brushed =  d3.selectAll(".brushed").data();


                   /* ~~~ Call pc or/and map function to filter ~~~ */

             }
         }//highlightBrushedCircles
         function isBrushed(brush_coords, cx, cy) {
              var x0 = brush_coords[0][0],
                  x1 = brush_coords[1][0],
                  y0 = brush_coords[0][1],
                  y1 = brush_coords[1][1];
             return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
         }//isBrushed



         //Select all the dots filtered
         this.selectDots = function(value){
			 // here you can take all the nodes and set them as unbrushed before they are stroked
			 var dots = d3.selectAll(".non_brushed");
			 
			 dots.style("stroke", function(d){
				 return value.every(function(c) { 
					return c.Accident_Index != d.Accident_Index ? "black" : null;
				 } ) ? null : "black";
			  } )
			  .style("stroke-width", 7) 
			  ;
			 
			 

         };


}//End

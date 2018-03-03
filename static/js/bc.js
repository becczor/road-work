
function bc(data){

    //console.log(data);

    this.data = data;
    // Function count_data is placed in main.js
    var counted_data = countOccurencies(data, "Day_of_Week");
    var div = '#bar-chart';

    var height = 500;
    var parentWidth = $(div).parent().width();
    var margin = {top: 20, right: 20, bottom: 60, left: 40},
        width = parentWidth - margin.right - margin.left,
        height = height - margin.top - margin.bottom;

    //var color = d3.scaleOrdinal(d3.schemeCategory20);

    var tooltip = d3.select(div).append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // scale configuration
    var x = d3.scaleBand()
          .range([0, width])
          .padding(0.1);
    var y = d3.scaleLinear().range([height, 0]);

    /* Task 2
      Initialize 4 (x,y,country,circle-size)
      variables and assign different data attributes from the data filter
      Then use domain() and extent to scale the axes*/
    /*var xValue = 'Day_of_Week';
    var yValue = 'Local_Authority_(District)';
    var radius = 'Accident_Severity';*/

    /*x and y domain code here, based on values from data*/
    x.domain(Object.keys(counted_data));
	y.domain(d3.extent(Object.values(counted_data)));

    // QUESTION: How do we know that we can apply extent on data, since it is an object and not an array?
    // https://github.com/d3/d3-array/blob/master/README.md#extent

    // Define axes from scaled variables
    var xAxis = d3.axisBottom(x);
    var yAxis = d3.axisLeft(y);

    /*var cValue = function(d) { return d.Accident_Index;};
    var color = d3.scaleOrdinal(d3.schemeCategory20b);*/

    // append the svg object to the div
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

    /*svg.append("text")
        .attr("class", "label")
        .attr("transform", "translate(" + (width/2) + " ," + (height + margin.top + 20) + ")")
        .style("text-anchor", "middle")
        .text("Day of week");*/

    svg.append("g")
        .attr("class", "axis")
        .call(yAxis);

    /*svg.append("text")
        .attr("class", "label")
        .style("text-anchor", "start")
        .text("1st Road Number");*/

    /* ~~ Task 4 Add the scatter dots. ~~ */

    // The enter function creates placeholders for missing objects that we are about to create

    var bars = svg.selectAll(".bar")
        .data(Object.entries(counted_data))

        .enter().append("rect")
        .attr("class", "bar")

        .attr("x", function(d) {
        	return x(d[0]); // d[0] is key of each entry
        })

        .attr("width", x.bandwidth())

        .attr("y", function(d){
            return y(d[1]);
        })
        .attr("height", function(d) {
        	return height - y(d[1]); // d[1] is value of each entry
        })

        .style("fill", "steelblue");

        /* ~~ Task 5 create the brush variable and call highlightBrushedCircles() ~~ */

        // Make circles non_brushed from beginning
        //.attr("class", "non_brushed");

    // Create a 2D brush and set event listener (what is going to happen in case of an event)
    /*var brush = d3.brush()
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


            /* ~~~ Call pc or/and map function to filter ~~~ 

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



    };*/


} //End

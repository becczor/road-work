function sp(data){

    //console.log(data);

    this.data = data;
    var div = '#scatter-plot';

    var height = 500;
    var parentWidth = $(div).parent().width();
    var margin = {top: 10, right: 20, bottom: 20, left: 50},
        width = parentWidth - margin.right - margin.left,
        height = height - margin.top - margin.bottom;

    var color = d3.scaleOrdinal(d3.schemeCategory20);

    var tooltip = d3.select(div).append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // scale configuration
    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    var radius = 'Accident_Severity';

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


    var xValue = document.getElementById('sel_x').value;
    var yValue = document.getElementById('sel_y').value;

    // x and y domain code here, based on values from data
    x.domain(d3.extent(data, function(d){return d[xValue];})).nice();
    y.domain(d3.extent(data, function(d){return d[yValue];})).nice();

    // Add the axes
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform","translate(" + 0 + "," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    // Add circles with data to the plot
    var circles = svg.selectAll("circles")
        .data(data)

        .enter().append("circle")
        .attr("class", "circles")
        .attr("r", function(d){
            return d[radius]*3;
        })

        .attr("cx", function(d){
            return x(d[xValue]);}
        )
        .attr("cy", function(d){
            return y(d[yValue]);}
        )

        .style("fill", function(d) { return color(cValue(d));})
        // Make circles non_brushed from beginning
        .attr("class", "non_brushed");

    var brush = d3.brush()
        .on("brush", highlightBrushedCircles);

    svg.append("g")
        .attr("class", "brush")
        .call(brush);

    function updateScatterAxis() {
        xValue = document.getElementById('sel_x').value;
        yValue = document.getElementById('sel_y').value;

        // x and y domain code here, based on values from data
        x.domain(d3.extent(data, function(d){return d[xValue];})).nice();
        y.domain(d3.extent(data, function(d){return d[yValue];})).nice();

        // Make the changes
        svg.selectAll("circle")
            .data(data) // Update with new data
            .transition()
            .duration(500)
            .attr("r", function(d){
                return d[radius]*3;
            })
            .attr("cx", function(d){
                return x(d[xValue]);
            })
            .attr("cy", function(d){
                return y(d[yValue]);
            });

        svg.select(".x.axis") // change the x axis
            .transition()
            .duration(500)
            .call(xAxis);

        svg.select(".y.axis") // change the y axis
            .transition()
            .duration(500)
            .call(yAxis);
    }

    // Sets function to call when values change for scatter plot axes.
    document.getElementById('sel_x').onchange = function() {
        updateScatterAxis();
    }
    document.getElementById('sel_y').onchange = function() {
        updateScatterAxis();
    }

    
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

            // Call functions here for connecting sp to map and bc

        }
    }

    function isBrushed(brush_coords, cx, cy) {
        var x0 = brush_coords[0][0],
            x1 = brush_coords[1][0],
            y0 = brush_coords[0][1],
            y1 = brush_coords[1][1];
        return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
    }



    //Select all the dots filtered
    this.selectDots = function(value){
        // take all the nodes and set them as unbrushed before they are stroked
        var dots = d3.selectAll(".non_brushed");

        dots.style("stroke", function(d){
            return value.every(function(c) {
                return c.Accident_Index != d.Accident_Index ? "black" : null;
            } ) ? null : "black";
        } )
            .style("stroke-width", 7)
        ;



    };


}

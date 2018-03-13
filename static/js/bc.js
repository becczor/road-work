
// Counts all occurencies of values for a given property. Returns object with the values and its count.
function countOccurencies(data, prop) {
	var counted = {};
	data.forEach(function(d) {
		// https://stackoverflow.com/questions/18690814/javascript-object-increment-item-if-not-exist
		counted[d[prop]] = (counted[d[prop]] || 0) + 1;
	});
	return counted;
}

function bc(data){
	//https://bl.ocks.org/d3noob/bdf28027e0ce70bd132edc64f1dd7ea4
	//http://bl.ocks.org/sjengle/e8c0d6abc0a8d52d4b11#chart.js

    this.data = data;
    var countBy = document.getElementById('sel_bc').value;
    var counted_data = countOccurencies(data, countBy);
    var div = '#bar-chart';

    var height = 500;
    var parentWidth = $(div).parent().width();
    var margin = {top: 20, right: 20, bottom: 60, left: 40},
        width = parentWidth - margin.right - margin.left,
        height = height - margin.top - margin.bottom;

    /*var cValue = function(d) { return d.Accident_Index;};
    var color = d3.scaleOrdinal(d3.schemeCategory20b);*/

    var tooltip = d3.select(div).append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // scale configuration
    var x = d3.scaleBand()
          .range([0, width])
          .padding(0.1);
    var y = d3.scaleLinear().range([height, 0]);

    // x and y domain code here, based on values from data
    x.domain(Object.keys(counted_data));
	y.domain([0,d3.max(Object.values(counted_data))]);

    // Define axes from scaled variables
    var xAxis = d3.axisBottom(x);
    var yAxis = d3.axisLeft(y);

    // append the svg object to the div
    var svg = d3.select(div).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform","translate(" + margin.left + "," + margin.top + ")");

    // Add the axes and place them correctly
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform","translate(" + 0 + "," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);


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

    function updateBarChart() {

        // Update the data
        countBy = document.getElementById('sel_bc').value;
        counted_data = countOccurencies(data, countBy);

        // Updated domain is needed
        x.domain(Object.keys(counted_data));
        y.domain([0,d3.max(Object.values(counted_data))]);

        // Now, update the bars! First, remove old bars
        var bars = svg.selectAll(".bar")
            .remove()
            .exit()
            .data(Object.entries(counted_data));

        // Add the new bars, to make sure we get the right number of bars
        bars.enter().append("rect")
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

        // And make sure the axes is updated aswell
        svg.select(".x.axis") // change the x axis
            .transition()
            .duration(500)
            .call(xAxis);

        svg.select(".y.axis") // change the y axis
            .transition()
            .duration(500)
            .call(yAxis);
    }

    // Sets function to call when property for bar chart changes
    document.getElementById('sel_bc').onchange = function() {
        updateBarChart();
    }

}

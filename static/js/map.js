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

    //initialize zoom
    var zoom = d3.zoom()
        .scaleExtent([1, 30])
        .on('zoom', move);

    //initialize tooltip
    var tooltip = d3.select(div).append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);


    /*~~ Task 11  initialize projection and path variable ~~*/
    var projection = d3.geoMercator()
        .scale(1400)
        .translate([width/2,height*3.8]);

    var path = d3.geoPath()
        .projection(projection);

    var svg = d3.select(div).append("svg")
        .attr("width", width)
        .attr("height", height)
        .call(zoom);

    var g = svg.append("g");

    // Collection corresponds to the first object in topojson file
    var areas = topojson.feature(area_map_json,
        area_map_json.objects.Local_Authority_Districts_Dec_2016).features;

    var geoAccidents = {type: "FeatureCollection", features: geoFormat(data)};

    //console.log("Areas:");
    //console.log(areas);
    //Formats the data in a feature collection
    function geoFormat(array) {
        var data = [];

        array.map(function (d, i) {
            data.push({
                index: d.Accident_Index,
                type: "Feature",
                geometry: {
                    coordinates: [d.Longitude, d.Latitude],
                    type: "Point"
                },
                no_of_vehicles: d.Number_of_Vehicles,
                year: d.Year,
                date: d.Date,
                time: d.Time,
                lad: d["Local_Authority_(District)"],
                day_of_week: d.Day_of_Week,
                speed_limit: d.Speed_limit,
                accident_severity: d.Accident_Severity

            });
        });
        return data;
    }

    //console.log("GeoAccidents:");
    //console.log(geoAccidents);

    var area = g.selectAll(".area").data(areas);

    /*~~ Task 12  initialize color array ~~*/
    var cc = [];

    data.forEach(function(element, index, array) { cc[element.Country] = color(index); });

    area.enter().insert("path")
        .attr("class", "area")

        /*~~ Task 11  add path variable as attr d here. ~~*/
        .attr("d", path)
        .attr("id", function(d) { return d.id; })
        .attr("title", function(d) { return d.properties.name; })
        .style("fill", function(d) { return cc[d.properties.name]; })

        //tooltip
        .on("mouseout",  function(d) {
            d3.select(this).style('stroke','none');
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        })
        //selection
        .on("click",  function(d) {
            d3.select(this).style('stroke','white');

            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            var mouse = d3.mouse(svg.node()).map( function(d) { return parseInt(d); } );
            tooltip
            // TODO: Make tooltip box big enough for the text.
                .attr("style", "left:"+(mouse[0]+30)+"px;top:"+(mouse[1]+30)+"px")
                .html(d.properties.lad16nm);

            /* //~~ call the other graphs method for selection here ~~
            var found = data.find(function(element) {
                return element.Country === d.properties.name;
            });
            sp.selectDots([found]);*/
        });

    drawPoints();


    function drawPoints(){
        var point = g.selectAll(".point").data(geoAccidents.features);
        point.enter().append("path")
            .attr("class", "point")
            .attr("d", path)
            .attr("d", path.pointRadius(function (d) {
                return d.accident_severity / 10;
            }))
            .style("opacity", 0.1)
            .on("mousemove", function (d) {
                //var cur_mag = d3.select("#slider").property("value");
                d3.select(this)
                    .style('opacity',1.0)
                    .style("stroke", 'red')
                //printInfo(d);
            })
            .on('mouseout',function(d){
                d3.select(this)
                    .style('opacity', 0.1)
                    .style("stroke", 'none');

            })
            .on("click",  function(d) {
                //console.log(d); // Feature collection of accident data
                var found = data.find(function(element) {
                    //console.log(element); // Element in actual data
                    return element.Accident_Index === d.index;
                });
                sp.selectDots([found]);
                /*~~ call the other graphs method for selection here ~~*/
            });
    }

    function move() {
        g.style("stroke-width", 1.5 / d3.event.transform.k + "px");
        g.attr("transform", d3.event.transform);
    }

    /*~~ Highlight countries when filtering in the other graphs~~*/
    this.selectCountry = function(value){

    }

}

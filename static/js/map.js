function clear(){
    document.getElementById("sel_light").reset();
}


function map(data, area_map_json){

    this.data = data;
    this.area_map_json = area_map_json;


    var div = '#world-map';
    var parentWidth = $(div).parent().width();
    var margin = {top: 0, right: 0, bottom: 0, left: 0},
        width = parentWidth - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var color = d3.scaleOrdinal(d3.schemeCategory20b);

    //initialize zoom
    var zoom = d3.zoom()
        .scaleExtent([1, 30])
        .on('zoom', move);

    //initialize tooltip
    var tooltip = d3.select(div).append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

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
                accident_severity: d.Accident_Severity,
                light_conditions: d.Light_Conditions

            });
        });
        return data;
    }

    var area = g.selectAll(".area").data(areas);

    var cc = [];

    data.forEach(function(element, index, array) { cc[element.Country] = color(index); });

    area.enter().insert("path")
        .attr("class", "area")

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
                .attr("style", "left:"+(mouse[0]+30)+"px;top:"+(mouse[1]+30)+"px")
                .html(d.properties.lad16nm);
        });

    var selectedlight = document.getElementById("sel_light").selectedIndex;
    var filter_light_param = document.getElementsByTagName("option")[selectedlight];

    //var selectedroad = document.getElementById("sel_road").selectedIndex;
    //var filter_road = document.getElementsByTagName("option")[selectedroad].text;

    //var selectedweather = document.getElementById("sel_weather").selectedIndex;
    //var filter_weather = document.getElementsByTagName("option")[selectedweather].text;

    drawPoints();

    function drawPoints(){
        if(filter_light_param)
        {
            // Add only data point that contains filtering text string
            var filtered_data = [];
            geoAccidents.features.forEach(function(d){
                if(d.light_conditions == filter_light_param.text) {
                    filtered_data.push(d);
                }
            });
            var point = g.selectAll(".point").data(filtered_data);
        }
        else{
            // Add all data
            var point = g.selectAll(".point").data(geoAccidents.features);
        }

        point.enter().append("path")
            .attr("class", "point")
            .attr("d", path)
            .attr("d", path.pointRadius(function (d) {
                return d.accident_severity / 10;
            }))
            .style("opacity", 0.1)
            .on("mousemove", function (d) {
                d3.select(this)
                    .style('opacity',1.0)
                    .style("stroke", 'red')
            })
            .on('mouseout',function(d){
                d3.select(this)
                    .style('opacity', 0.1)
                    .style("stroke", 'none');

            })
            .on("click",  function(d) {
                var found = data.find(function(element) {
                    return element.Accident_Index === d.index;
                });
                sp.selectDots([found]);
            });
    }

    function move() {
        g.style("stroke-width", 1.5 / d3.event.transform.k + "px");
        g.attr("transform", d3.event.transform);
    }
    
    this.selectCountry = function(value){

    }

}

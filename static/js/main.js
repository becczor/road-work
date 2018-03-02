queue()
    .defer(d3.csv,'static/data/data-small.csv')
    .defer(d3.json,'static/maps/Local_Authority_Districts_Dec_2016-topo.json')
    .await(draw);

var sp, map, bc;

function draw(error, data, area_map_json){
    if (error) throw error;

    sp = new sp(data);
    map = new map(data, area_map_json);
    bc = new bc(data);

}
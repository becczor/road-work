queue()
  .defer(d3.csv,'static/data/data.csv')
  .defer(d3.json,'static/maps/Areas-topo.json')
  .await(draw);

var sp, map;

function draw(error, data, area_map_json){
  if (error) throw error;

  sp = new sp(data);
  map = new map(data, area_map_json);

}

document.addEventListener('DOMContentLoaded', function(e) {
  // Dimensions and margins of the graph
  var width = 500
  height = 500
  margin = 50

  // Radius of the pieplot
  var radius = Math.min(width, height) / 2 - margin

  // Appending the svg object to the div called "record_chart"
  var svg = d3.select("#record_chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  // Data: number of wins, draws and defeats
  var data = {
    "wins": 17,
    "draws": 11,
    "defeats": 8
  }

  // Color scale
  var color = d3.scaleOrdinal()
    .domain(data)
    .range(['#32CD32', '#FFFF00', '#E50000']);

  // Position of groups on the pie
  var pie = d3.pie()
    .value(function(d) {
      return d.value;
    })
  var data_ready = pie(d3.entries(data))

  // Building arcs
  var arcGenerator = d3.arc()
    .innerRadius(0)
    .outerRadius(radius)

  // Building the pie chart
  svg
    .selectAll("slices")
    .data(data_ready)
    .enter()
    .append("path")
    .attr("d", arcGenerator)
    .attr("fill", function(d) {
      return (color(d.data.key))
    })
    .attr("stroke", "black")
    .style("stroke-width", "2px")
    .style("opacity", 0.7)

  // Annotation with usage of the centroid method to get the best coordinates
  svg
    .selectAll("slices")
    .data(data_ready)
    .enter()
    .append("text")
    .text(function(d) {
      return d.data.value
    })
    .attr("transform", function(d) {
      return "translate(" + arcGenerator.centroid(d) + ")";
    })
    .style("text-anchor", "middle")
    .style("font-size", 17)
});
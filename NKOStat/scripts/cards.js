document.addEventListener('DOMContentLoaded', function(e) {
    // Dimensions and margins of the graph
var margin = {top: 30, right: 30, bottom: 70, left: 60},
width = 960 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;

// Appending the svg object to the div called "cards_chart"
var svg = d3.select("#cards_chart")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

// Fetching and parsing the data
d3.csv("../../data/cards.csv", function(data) {

// Lists of subgroups and seasons
var subgroups = data.columns.slice(1)
var seasons = d3.map(data, function(d){return(d.season)}).keys()

// X axis
var x = d3.scaleBand()
  .domain(seasons)
  .range([0, width])
  .padding([0.2])
svg.append("g")
.attr("transform", "translate(0," + height + ")")
.call(d3.axisBottom(x).tickSize(0));

// Y axis
var y = d3.scaleLinear()
.domain([0, 120])
.range([ height, 0 ]);
svg.append("g")
.call(d3.axisLeft(y));

// Position of subgroup
var xSubgroup = d3.scaleBand()
.domain(subgroups)
.range([0, x.bandwidth()])
.padding([0.05])

// Color scale
var color = d3.scaleOrdinal()
.domain(subgroups)
.range(['yellow', 'red'])

// Bars
svg.append("g")
.selectAll("g")
.data(data)
.enter()
.append("g")
  .attr("transform", function(d) { return "translate(" + x(d.season) + ",0)"; })
.selectAll("rect")
.data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
.enter().append("rect")
  .attr("x", function(d) { return xSubgroup(d.key); })
  .attr("y", function(d) { return y(d.value); })
  .attr("width", xSubgroup.bandwidth())
  .attr("height", function(d) { return height - y(d.value); })
  .attr("fill", function(d) { return color(d.key); })
})
  });
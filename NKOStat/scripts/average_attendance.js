document.addEventListener('DOMContentLoaded', function(e) {
  // Dimensions and margins of the graph
  var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// Appending the svg object to the div called "average_attendance_chart"
var svg = d3.select("#average_attendance_chart")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Fetching and parsing the data
d3.csv("../../data/average_attendance.csv", function(data) {

// X axis
var x = d3.scaleBand()
  .range([ 0, width ])
  .domain(data.map(function(d) { return d.season; }))
  .padding(0.2);
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x))
  .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

// Y axis
var y = d3.scaleLinear()
  .domain([1000, 10000])
  .range([ height, 0]);
svg.append("g")
  .call(d3.axisLeft(y));

// Tooltip
var tooltip = d3.select("#average_attendance_chart")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px")

      // Functions for changing the tooltip when user goes over it
      var mouseover = function(d) {
        tooltip
          .style("opacity", 1)
      }
      var mousemove = function(d) {
        tooltip
          .html("Average attendance: " + d.average_attendance)
          .style("left", (d3.mouse(this)[0]+70) + "px")
          .style("top", (d3.mouse(this)[1]) + "px")
      }
      var mouseleave = function(d) {
        tooltip
          .style("opacity", 0)
      }

// Bars
svg.selectAll()
  .data(data)
  .enter()
  .append("rect")
    .attr("x", function(d) { return x(d.season); })
    .attr("y", function(d) { return y(d.average_attendance); })
    .attr("width", x.bandwidth())
    .attr("height", function(d) { return height - y(d.average_attendance); })
    .attr("fill", "#8B0000")
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)
})
});
document.addEventListener('DOMContentLoaded', function(e) {
  // Dimensions and margins of the graph
  var margin = {
      top: 30,
      right: 30,
      bottom: 70,
      left: 60
    },
    width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  // Appending the svg object to the div called "goalscorers_chart"
  var svg = d3.select("#goalscorers_chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  // Fetching and parsing the data
  d3.csv("../../data/goalscorers.csv", function(data) {

    // X axis
    var x = d3.scaleBand()
      .range([0, width])
      .domain(data.map(function(d) {
        return d.player;
      }))
      .padding(0.2);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    // Y axis
    var y = d3.scaleLinear()
      .domain([0, 22])
      .range([height, 0]);
    svg.append("g")
      .call(d3.axisLeft(y));

    // Tooltip
    var tooltip = d3.select("#goalscorers_chart")
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
        .html("Goals scored: " + d.goals)
        .style("left", (d3.mouse(this)[0] + 70) + "px")
        .style("top", (d3.mouse(this)[1]) + "px")
    }
    var mouseleave = function(d) {
      tooltip
        .style("opacity", 0)
    }

    // Bars
    svg.selectAll("bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", function(d) {
        return x(d.player);
      })
      .attr("y", function(d) {
        return y(d.goals);
      })
      .attr("width", x.bandwidth())
      .attr("height", function(d) {
        return height - y(d.goals);
      })
      .attr("fill", "#000058")
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
  })
});
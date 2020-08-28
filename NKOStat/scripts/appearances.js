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

  // Appending the svg object to the div called "appearances_chart"
  var svg = d3.select("#appearances_chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  // Fetching and parsing the data
  d3.csv("../../data/appearances.csv", function(data) {

    // Lists of subgroups and players
    var subgroups = data.columns.slice(1)
    var players = d3.map(data, function(d) {
      return (d.player)
    }).keys()

    // X axis
    var x = d3.scaleBand()
      .domain(players)
      .range([0, width])
      .padding([0.2])
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).tickSizeOuter(0))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    // Y axis
    var y = d3.scaleLinear()
      .domain([0, 40])
      .range([height, 0]);
    svg.append("g")
      .call(d3.axisLeft(y));

    // Color scale
    var color = d3.scaleOrdinal()
      .domain(subgroups)
      .range(['#8B0000', '#FF3333'])

    // Stacking the data per subgroups
    var stackedData = d3.stack()
      .keys(subgroups)
      (data)

    // Tooltip
    var tooltip = d3.select("#appearances_chart")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px")

    // Functions for changing the tooltip when user goes over it
    var mouseover = function(d) {
      var subgroupName = d3.select(this.parentNode).datum().key;
      var subgroupValue = d.data[subgroupName];
      tooltip
        .html("Appearances, " + subgroupName + ": " + subgroupValue + " matches")
        .transition()
        .style("opacity", 1)
    }
    var mousemove = function(d) {
      tooltip
        .style("left", (d3.mouse(this)[0] + 90) + "px")
        .style("top", (d3.mouse(this)[1]) + "px")
    }
    var mouseleave = function(d) {
      tooltip
        .transition()
        .duration(500)
        .style("opacity", 0)
    }

    // Bars
    svg.append("g")
      .selectAll("g")
      .data(stackedData)
      .enter().append("g")
      .attr("fill", function(d) {
        return color(d.key);
      })
      .selectAll("rect")
      .data(function(d) {
        return d;
      })
      .enter().append("rect")
      .attr("x", function(d) {
        return x(d.data.player);
      })
      .attr("y", function(d) {
        return y(d[1]);
      })
      .attr("height", function(d) {
        return y(d[0]) - y(d[1]);
      })
      .attr("width", x.bandwidth())
      .attr("stroke", "grey")
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
  })
});
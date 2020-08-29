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

  // Appending the svg object to the div called "appearances_2_chart"
  var svg = d3.select("#appearances_2_chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  // X axis initialization
  var x = d3.scaleBand()
    .range([ 0, width ])
    .padding(0.2);
  var xAxis = svg.append("g")
    .attr("transform", "translate(0," + height + ")")

  // Y axis initialization
  var y = d3.scaleLinear()
    .range([ height, 0]);
  var yAxis = svg.append("g")
    .attr("class", "Yaxis")

  // A function for updating view dependently on given variable
  function update_view(appearance) {

      // Fetching and parsing the data
      d3.csv("../../data/appearances.csv", function(data) {

        // Sorting the data
        data.sort(function(b, a) {
            if (appearance == 'starting')
            {
              return a.starting - b.starting;
            }
            else if (appearance == 'substitution')
            {
              return a.substitution - b.substitution;
            }
        });

        // X axis
        x.domain(data.map(function(d) { 
          return d.player; 
        }))
        xAxis.transition()
            .duration(1000)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

        // Y axis
        y.domain([0, d3.max(data, function(d) { 
          return +d[appearance] 
        }) ]);
        yAxis.transition()
            .duration(1000)
            .call(d3.axisLeft(y));

        // Variable update – mapping the data to existing bars
        var update = svg.selectAll("rect")
            .data(data)

        // Updating the bars
        update
        .enter()
        .append("rect")
        .merge(update)
        .transition()
        .duration(1000)
        .attr("x", function(d) { 
          return x(d.player); 
        })
        .attr("y", function(d) { 
          return y(d[appearance]); 
        })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { 
          return height - y(d[appearance]); 
        })
        .attr("fill", "#000058");
      })
    }
  
  // View initialization
  update_view('starting')
});
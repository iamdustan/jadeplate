/**
 * function to insert a pie chart into an element
 */
function PieChart(element, data, options) {
  
  options = options || {};
  var width =  options.width || 300,
      height = options.height || 300,
      radius = Math.min(width, height) / 2,
      color = options.colors || d3.scale.category10(),
      donut = d3.layout.pie(),
      innerRadius = options.innerRadius || radius * 0.3,
      arc = d3.svg.arc().innerRadius(innerRadius).outerRadius(radius);
    console.log( arc );

  var vis = d3.select(element).append("svg")
    .attr("class", "piechart")
      .data([data])
      .attr("width", width)
      .attr("height", height);

  var arcs = vis.selectAll("g.arc")
      .data(donut)
    .enter().append("g")
      .attr("class", "arc")
      .attr("transform", "translate(" + radius + "," + radius + ")");

  var paths = arcs.append("path")
      .attr("fill", 
        function(d, i) { 
          return color(i); 
        })
      .attr("d", arc);

  arcs.append("text")
      .attr("transform", 
        function(d) { 
          return "translate(" + arc.centroid(d) + ")"; 
        })
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .attr("display", 
        function(d) { 
          return d.value > 2 ? null : "none"; 
        })
      .text(
        function(d, i) { 
          console.log(d, i);
          return d.value.toFixed(0); 
        });
}

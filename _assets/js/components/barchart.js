/**
 * function to insert a vertical bar chart into an element
 */
var _ = require('underscore');

function BarChart(element, data, options) {

  var self = this;

  this.options = options || {};
  _.defaults(this.options, {
    is_currency: true,
    bar_labels: false,
    height: 150,
    colors: ["#fd6f0a", "#fff"],
    padding: 20,
    bar_padding: 10,
    classes: {
      chart: 'barchart',
      colLabel: 'colLabel',
      barLabel: 'barLabel',
      yAxisLabel: 'rule'
    }
  });

  this.data = data;
  this.colors = d3.scale.category10();

  this.element = element;
  this.width = this.options.width || $(element).width();
  this.height = this.options.height;
  this.height_offset = 20;
  this.height_adjusted = this.height - this.height_offset - this.options.padding;
  this.width_offset = 10;
  this.width_adjusted = this.width - this.width_offset;

  this.yScale = d3.scale.linear()
     .domain([0, d3.max(data, function(d) { return d3.max(d.val); })])
     .range([0, this.height_adjusted]);

  var num = this.data[0].val.length;

  // helper function for positioning and sizing
  this.w = function() { return (self.width / self.data.length) - self.options.bar_padding;};
  this.x = function(d, i) {return (i * (self.width_adjusted/self.data.length)) + self.width_offset;};
  this.axisY = function(d) { return self.height_adjusted - self.yScale(d); };
  this.barX = function(d,i,index) { return (self.x(d,i) + self.options.bar_padding/num) + (self.w()/num)*index; };
  this.barY = function(d,i, index) { return self.height_adjusted - self.yScale(d.val[index]); };
  this.barWidth = function(d,i) {
    var padding = num > 1 ? self.options.bar_padding : self.options.bar_padding/2,
        width = self.w() - padding;
    return num  > 1 ? width/num : width; 
  };
  this.barHeight = function(d,i, index) { return self.yScale(d.val[index]); };
  this.barLabelY = function(d) { return self.height_adjusted - self.yScale(d.val[0]) + 10; };
  this.barLabelX = function(d,i) { return self.x(d,i) + self.w()/2; };
  this.barLabelText = function(d) { return self.dollarFormat(d.val[0]); };
  this.colLabelX = function(d,i) { return self.x(d,i) + self.options.bar_padding/num + self.w()/2; };
  this.colLabelText = function(d) { 
    if (d && d.getMonth) return d && d.getMonth() + 1 + "/" + d.getFullYear();
    else return d;
  };
}

BarChart.prototype = {
  dollarFormat: function(n) {
    var dollar_sign = this.options.is_currency ? "$" : "" ;
    return dollar_sign + d3.format(",r")(parseInt(n,10));
  },
  addSVG: function() {
    this.chart = d3.select(this.element).append("svg")
        .attr("class", this.options.classes.chart)
        .attr("width", this.width)
        .attr("height", this.height)
      .append("g")
        .attr("transform", "translate("+this.width_offset+","+this.height_offset+")");
  },

  drawBars: function() {
    var self = this,
        colors = this.colors,
        num = this.data[0].val.length;

    var bars = this.chart.selectAll("rect").data(this.data).enter();

    // iterate through
    for (var index = 0; index < num; index++) barSet(index);

    // function to draw each set of bars according to the number of values for each item in data array
    function barSet(index) {
      bars.append("rect")
          .attr("x", function(d,i) {return self.barX(d,i,index);})
          .attr("y", function(d,i) {return self.barY(d,i,index);})
          .attr("width", self.barWidth)
          .attr("height", function(d,i) {return self.barHeight(d,i,index);})
          .style("fill", colors(index % 10));
    }
  },

  drawLines: function() {
    var self = this;
    this.chart.selectAll("line")
        .data(this.yScale.ticks(5))
      .enter().append("line")
        .attr("y1", this.axisY)
        .attr("y2", this.axisY)
        .attr("x1", this.width_offset)
        .attr("x2", this.width_adjusted)
        .style("stroke", "#ddd");
  },

  drawYAxisLabels: function() {
    var self = this;
    this.chart.selectAll("."+this.options.classes.yAxisLabel)
        .data(this.yScale.ticks(5))
      .enter().append("text")
        .attr("class", this.options.classes.yAxisLabel)
        .attr("x", 0)
        .attr("y", this.axisY)
        .attr("dy", -3)
        .attr("text-anchor", "start")
        .text(function(d) {return d;});
  },

  drawBarLabels: function() {
    var self = this;
    this.chart.selectAll("."+this.options.classes.barLabel)
        .data(this.data)
      .enter().append("text")
        .attr("class", this.options.classes.barLabel)
        .attr("y", this.barLabelY)
        .attr("x", this.barLabelX)
        .attr("width", self.w)
        .attr("dy", ".35em") // vertical-align: middle
        .attr("text-anchor", "middle")
        .attr("display", function(d) { return self.yScale(d.val[0]) > 20 ? null : "none"; })
        .text(this.barLabelText);
  },

  drawColLabels: function() {
    var self = this,
        num = this.data[0].val.length;
    this.chart.selectAll("."+this.options.classes.colLabel)
        .data(_.pluck(this.data, 'column'))
      .enter().append("text")
        .attr("class", this.options.classes.colLabel)
        .attr("x", this.colLabelX)
        .attr("y", self.height - self.height_offset)
        .attr("dy", -3)
        .attr("text-anchor", "middle")
        .text(this.colLabelText);
  },

  render: function() {
    this.addSVG();
    this.drawLines();
    this.drawYAxisLabels();
    this.drawBars();
    if (this.options.bar_labels) this.drawBarLabels();
    this.drawColLabels();
  }
};

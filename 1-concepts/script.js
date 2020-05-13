var w = 500;
var h = 500;
var data0 = [
  { gpa: 3.42, height: 138 },
  { gpa: 3.54, height: 153 },
  { gpa: 3.14, height: 148 },
  { gpa: 2.76, height: 164 },
  { gpa: 2.95, height: 162 },
  { gpa: 3.36, height: 143 },
];

var data1 = [
  { gpa: 3.15, height: 157 },
  { gpa: 3.12, height: 175 },
  { gpa: 3.67, height: 167 },
  { gpa: 3.85, height: 149 },
  { gpa: 2.32, height: 165 },
  { gpa: 3.01, height: 171 },
  { gpa: 3.54, height: 168 },
  { gpa: 2.89, height: 180 },
  { gpa: 3.75, height: 153 },
];

// One dummy circle
// =========================================================================
// =========================================================================
var svg = d3
  .select("body")
  .append("svg")
  .attr("width", 100)
  .attr("height", 100);
var circles = svg.append("circle");
circles.attr("cx", 50).attr("cy", 50).attr("r", 5).attr("fill", "grey");

// Bindind data ============================================================
// =========================================================================
// =========================================================================

var svgBinded = d3
  .select("body")
  .append("svg")
  .attr("width", w)
  .attr("height", h);

var circlesWithData = svgBinded
  .selectAll("circles")
  .data(data0)
  .enter()
  .append("circle")
  .attr("cx", (d, i) => {
    return 25 + 50 * i;
  })
  .attr("cy", (d, i) => {
    return 25 + 50 * i;
  })
  .attr("r", 5)
  .attr("fill", "grey");

// Circle scale Linear and axis ============================================
// =========================================================================
// https://www.d3indepth.com/scales/
// https://github.com/d3/d3-scale
// =========================================================================

var svgScaledCircles = d3
  .select("body")
  .append("svg")
  .attr("width", w)
  .attr("height", h);

var scaledCircles = svgScaledCircles.selectAll("circles").data(data0);

var x = d3
  .scaleLinear()
  .domain([
    d3.min(data0, function (d) {
      return d.gpa;
    }) / 1.05,
    d3.max(data0, function (d) {
      return d.gpa;
    }) * 1.05,
  ])
  .range([0, 800]);

var y = d3
  .scaleLinear()
  .domain([
    d3.min(data0, function (d) {
      return d.height;
    }) / 1.05,
    d3.max(data0, function (d) {
      return d.height;
    }) * 1.05,
  ])
  .range([500, 0]);

scaledCircles
  .enter()
  .append("circle")
  .attr("cx", function (d) {
    return x(d.gpa);
  })
  .attr("cy", function (d) {
    return y(d.height);
  })
  .attr("r", 5)
  .attr("fill", "grey");

// Scale Linear and axis ===================================================
// =========================================================================
// https://www.d3indepth.com/scales/
// https://github.com/d3/d3-scale
// =========================================================================

var svgScale = d3
  .select("body")
  .append("svg")
  .attr("width", w)
  .attr("height", h);

var margin = { top: 10, right: 10, bottom: 50, left: 50 };
var width = +svgScale.attr("width") - margin.left - margin.right;
var height = +svgScale.attr("height") - margin.top - margin.bottom;
var flag = true;

// Scales
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

var g = svgScale
  .append("g")
  .attr("transform", `translate(${margin.left} , ${margin.top})`);

// Axes
var xAxisCall = d3.axisBottom(x); // create the x Axis
var xAxis = g
  .append("g")
  .attr("class", "x-axis")
  .attr("transform", `translate(0 , ${height})`);

var yAxisCall = d3.axisLeft(y); // create the Y Axis
var yAxis = g.append("g").attr("class", "y-axis");

// Labels
xAxis
  .append("text")
  .attr("class", "axis-title")
  .attr("transform", `translate(${width} , 0)`)
  .attr("y", -6)
  .text("Grade Point Average");
yAxis
  .append("text")
  .attr("class", "axis-title")
  .attr("transform", "rotate(-90)")
  .attr("y", 16)
  .text("Height / Centimeters");

var flag = true;

// Run this code every second...
d3.interval(function () {
  // Flick between our two data arrays
  data = flag ? data0 : data1;

  // Update our chart with new data
  update(data);

  // Update our flag variable
  flag = !flag;
}, 1000);

function update(data) {
  // Standard transition for our visualization
  var t = d3.transition().duration(750);

  // Update our scales
  x.domain([
    d3.min(data, function (d) {
      return d.gpa;
    }) / 1.05,
    d3.max(data, function (d) {
      return d.gpa;
    }) * 1.05,
  ]);
  y.domain([
    d3.min(data, function (d) {
      return d.height;
    }) / 1.05,
    d3.max(data, function (d) {
      return d.height;
    }) * 1.05,
  ]);

  // Update our axes
  xAxis.call(xAxisCall);
  yAxis.call(yAxisCall);

  // Update our circles
  var circles = g.selectAll("circle").data(data);

  circles.exit().remove();

  circles
    .attr("cx", function (d) {
      return x(d.gpa);
    })
    .attr("cy", function (d) {
      return y(d.height);
    });

  circles
    .enter()
    .append("circle")
    .attr("cx", function (d) {
      return x(d.gpa);
    })
    .attr("cy", function (d) {
      return y(d.height);
    })
    .attr("r", 5)
    .attr("fill", "grey");
}

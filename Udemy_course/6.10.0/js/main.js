/*
 *    main.js
 *    Mastering Data Visualization with D3.js
 *    CoinStats
 */

var margin = { left: 80, right: 100, top: 50, bottom: 100 },
  height = 500 - margin.top - margin.bottom,
  width = 800 - margin.left - margin.right;

var data;

// TODO: can be removed those 2 vars ? check it
var coinSelected = "bitcoin";
var cryptocurrency = "price_usd";

var svg = d3
  .select("#chart-area")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom);

var g = svg
  .append("g")
  .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

var t = d3.transition().duration(100);

// Time parser for x-scale
var parseTime = d3.timeParse("%d/%m/%Y");
// For tooltip
var bisectDate = d3.bisector(function (d) {
  return d.year;
}).left;

// Scales
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// Y  Format:
var formatSi = d3.format(".2s");

// Axis generators
var xAxisCall = d3.axisBottom().ticks(4);
var yAxisCall = d3.axisLeft().tickFormat(formatAbbreviation);

// Axis groups
var xAxis = g
  .append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")");
var yAxis = g.append("g").attr("class", "y axis");

// Axis label
g.append("text")
  .attr("y", height + 50)
  .attr("x", width / 2)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("Time");

var yAxisLabel = yAxis
  .append("text")
  .attr("class", "axis-title")
  .attr("transform", "rotate(-90)")
  .attr("y", -margin.left + 10)
  .attr("x", -(height / 2))
  .attr("dy", ".71em")
  .style("text-anchor", "middle")
  .attr("font-size", "20px")
  .attr("fill", "#333");

var path = g
  .append("path")
  .attr("class", "line")
  .attr("fill", "none")
  .attr("stroke", "grey")
  .attr("stroke-with", "3px");

// Line path generator
var line = d3
  .line()
  .x(function (d) {
    return x(d.year);
  })
  .y(function (d) {
    return y(d.value);
  });

// Listeners
$("#coin-select").on("change", () => updateData());
$("#var-select").on("change", () => updateData());

// Load data and init graph
d3.json("data/coins.json").then(function (dataRetreived) {
  data = dataRetreived;
  updateData();
});

function updateData() {
  coinSelected = $("#coin-select").val();
  cryptocurrency = $("#var-select").val();

  // Filter data
  filteredData = data[coinSelected]
    .filter(function (d) {
      return d[cryptocurrency];
    })
    .map((d) => {
      d.year = parseTime(d.date);
      d.value = +d[cryptocurrency];
      return d;
    });

  console.log("original data", data);
  console.log("filtered data", filteredData);

  // Set scale domains
  x.domain(
    d3.extent(filteredData, function (d) {
      return d.year;
    })
  );
  y.domain([
    d3.min(filteredData, function (d) {
      return d.value;
    }) / 1.005,
    d3.max(filteredData, function (d) {
      return d.value;
    }) * 1.005,
  ]);

  var label = getLabelFomCurrencySelected();
  yAxisLabel.text(label);

  // Generate axes once scales have been set
  xAxis.transition(t).call(xAxisCall.scale(x));
  yAxis.transition(t).call(yAxisCall.scale(y).tickFormat(formatAbbreviation));

  // Add line to path generated above
  path.transition(t).attr("d", line(filteredData));

  /******************************** Tooltip Code ********************************/

  var focus = g.append("g").attr("class", "focus").style("display", "none");

  focus
    .append("line")
    .attr("class", "x-hover-line hover-line")
    .attr("y1", 0)
    .attr("y2", height);

  focus
    .append("line")
    .attr("class", "y-hover-line hover-line")
    .attr("x1", 0)
    .attr("x2", width);

  focus.append("circle").attr("r", 7.5);

  focus.append("text").attr("x", 15).attr("dy", ".31em");

  g.append("rect")
    .attr("class", "overlay")
    .attr("width", width)
    .attr("height", height)
    .on("mouseover", function () {
      focus.style("display", null);
    })
    .on("mouseout", function () {
      focus.style("display", "none");
    })
    .on("mousemove", mousemove);

  function mousemove() {
    var x0 = x.invert(d3.mouse(this)[0]),
      i = bisectDate(filteredData, x0, 1),
      d0 = filteredData[i - 1],
      d1 = filteredData[i],
      d = x0 - d0.year > d1.year - x0 ? d1 : d0;
    focus.attr("transform", "translate(" + x(d.year) + "," + y(d.value) + ")");
    focus.select("text").text(() => d3.format("$,")(d.value.toFixed(2)));
    focus.select(".x-hover-line").attr("y2", height - y(d.value));
    focus.select(".y-hover-line").attr("x2", -x(d.year));
  }
}

// Helpers:
function getLabelFomCurrencySelected() {
  switch (cryptocurrency) {
    case "24h_vol":
      return "24 Hour Trading Volume (USD)";
      break;
    case "market_cap":
      return "Market Capitalization (USD)";
    default:
      return "Price (USD)";
      break;
  }
}

function formatAbbreviation(x) {
  var s = formatSi(x);
  switch (s[s.length - 1]) {
    case "G":
      return s.slice(0, -1) + "B";
    case "k":
      return s.slice(0, -1) + "K";
  }
  return s;
}

/*
 *    main.js
 *    Mastering Data Visualization with D3.js
 *    CoinStats
 */

var margin = { left: 80, right: 100, top: 50, bottom: 100 },
  height = 500 - margin.top - margin.bottom,
  width = 800 - margin.left - margin.right;

var originalData;
var filteredData;
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

var t = function () {
  return d3.transition().duration(1000);
};

// Time parser for x-scale
var parseTime = d3.timeParse("%d/%m/%Y");
var formatTime = d3.timeFormat("%d/%m/%Y");

// For tooltip
var bisectDate = d3.bisector(function (d) {
  return d.date;
}).left;

// Scales
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// Y  Format:
var formatSi = d3.format(".2s");

// Axis generators
var xAxisCall = d3.axisBottom().ticks(4);
var yAxisCall = d3.axisLeft();

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

// Listeners
$("#coin-select").on("change", () => updateData());
$("#var-select").on("change", () => updateData());
$("#date-slider").slider({
  max: parseTime("31/10/2017").getTime(),
  min: parseTime("12/5/2013").getTime(),
  step: 86400000, // One day
  values: [parseTime("12/5/2013").getTime(), parseTime("31/10/2017").getTime()],
  slide: function (event, ui) {
    $("#dateLabel1").text(formatTime(new Date(ui.values[0])));
    $("#dateLabel2").text(formatTime(new Date(ui.values[1])));
    updateData();
  },
});
// Load data and init graph
d3.json("data/coins.json").then(function (data) {
  filteredData = {};
  for (var coin in data) {
    if (!data.hasOwnProperty(coin)) {
      continue;
    }

    filteredData[coin] = data[coin].filter(function (d) {
      return !(d["price_usd"] == null);
    });
    filteredData[coin].forEach(function (d) {
      d["price_usd"] = +d["price_usd"];
      d["24h_vol"] = +d["24h_vol"];
      d["market_cap"] = +d["market_cap"];
      d["date"] = parseTime(d["date"]);
    });
  }
  updateData();
});

function updateData() {
  coinSelected = $("#coin-select").val();
  cryptocurrency = $("#var-select").val();
  sliderValues = $("#date-slider").slider("values");

  var dataTimeFiltered = filteredData[coinSelected].filter(function (d) {
    return d.date >= sliderValues[0] && d.date <= sliderValues[1];
  });

  // Set scale domains
  x.domain(d3.extent(dataTimeFiltered, (d) => d.date));
  y.domain([
    d3.min(dataTimeFiltered, (d) => d[cryptocurrency]) / 1.005,
    d3.max(dataTimeFiltered, (d) => d[cryptocurrency]) * 1.005,
  ]);

  var label = getLabelFomCurrencySelected();
  yAxisLabel.text(label);

  // Generate axes once scales have been set
  xAxis.call(xAxisCall.scale(x)).transition(t);
  yAxis.call(yAxisCall.scale(y).tickFormat(formatAbbreviation)).transition(t);

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
      i = bisectDate(dataTimeFiltered, x0, 1),
      d0 = dataTimeFiltered[i - 1],
      d1 = dataTimeFiltered[i],
      d = x0 - d0.date > d1.date - x0 ? d1 : d0;
    focus.attr(
      "transform",
      "translate(" + x(d.date) + "," + y(d[cryptocurrency]) + ")"
    );
    focus
      .select("text")
      .text(() => d3.format("$,")(d[cryptocurrency].toFixed(2)));
    focus.select(".x-hover-line").attr("y2", height - y(d[cryptocurrency]));
    focus.select(".y-hover-line").attr("x2", -x(d.date));
  }

  // Line path generator
  var line = d3
    .line()
    .x((d) => x(d.date))
    .y((d) => y(d[cryptocurrency]));

  // Add line to path generated above
  path.transition(t).attr("d", line(dataTimeFiltered));
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

require(["data"], function (data) {
  // todo: check if could be used autype instead of the loop in data.js
  console.log("autotype", d3.autoType({ date: "2007-04-23", close: "93.24" }));

  var width = window.innerWidth;
  height = 240;
  margin = { top: 20, right: 30, bottom: 30, left: 40 };

  var svg = d3
    .select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  var x = d3
    .scaleUtc()
    .domain(d3.extent(data, (d) => d.date))
    .range([margin.left, width - margin.right]);

  var y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.upper)])
    .range([height - margin.bottom, margin.top]);

  var yAxis = (g) =>
    g
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(height / 40))
      .call((g) => g.select("domain").remove());

  var xAxis = (g) =>
    g.attr("transform", `translate(0,${height - margin.bottom})`).call(
      d3
        .axisBottom(x)
        .ticks(width / 80)
        .tickSizeOuter(0)
    );

  var line = d3
    .line()
    .x((d) => x(d.date))
    .y((d) => y(d.close));

  svg.append("g").call(xAxis).node();
  svg.append("g").call(yAxis).node();

  svg
    .append("path")
    .attr("d", line(data))
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("fill", "none");

  // ============================================================================
  // ============================================================================
  // ============================================================================

  var svgArea = d3
    .select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  var area = d3
    .area()
    .x((d) => x(d.date))
    .y0(y(0))
    .y1((d) => y(d.close));

  svgArea
    .append("path")
    .attr("d", area(data))
    .attr("stroke", "steelblue")
    .attr("fill", "steelblue");

  svgArea.append("g").call(xAxis).node();
  svgArea.append("g").call(yAxis).node();

  // ============================================================================
  // ============================================================================
  // ============================================================================

  var svgAreaBand = d3
    .select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  var areaBand = d3
    .area()
    .x((d) => x(d.date))
    .y0((d) => y(d.lower))
    .y1((d) => y(d.upper));

  svgAreaBand
    .append("path")
    .attr("d", areaBand(data))
    .attr("stroke", "steelblue")
    .attr("fill", "steelblue");

  svgAreaBand.append("g").call(xAxis).node();
  svgAreaBand.append("g").call(yAxis).node();

  // ============================================================================
  // ============================================================================
  // ============================================================================

  var svgLineMiddle = d3
    .select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  var lineMiddle = d3
    .line()
    .x((d) => x(d.date))
    .y((d) => y(d.middle));

  svgLineMiddle.append("path").attr("d", areaBand(data)).attr("fill", "#ddd");

  svgLineMiddle
    .append("path")
    .attr("d", lineMiddle(data))
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("fill", "none");

  svgLineMiddle
    .append("path")
    .attr("d", line(data))
    .attr("stroke", "#f00")
    .attr("stroke-width", 1.5)
    .attr("fill", "none");

  svgLineMiddle.append("g").call(xAxis).node();
  svgLineMiddle.append("g").call(yAxis).node();

  // ============================================================================
  // ============================================================================
  // ============================================================================

  var svgAreaWithLines = d3
    .select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  var newG = svgAreaWithLines
    .append("g")
    .attr("fill", "none")
    .attr("stroke-width", 1.5)
    .attr("stroke-miterlimit", 1.5);

  newG.append("path").attr("d", areaBand.lineY0()(data)).attr("stroke", "#00f");

  newG.append("path").attr("d", areaBand.lineY1()(data)).attr("stroke", "#f00");

  svgAreaWithLines
    .append("path")
    .attr("d", areaBand(data))
    .attr("fill", "#ddd");

  svgAreaWithLines.append("g").call(xAxis).node();
  svgAreaWithLines.append("g").call(yAxis).node();
});

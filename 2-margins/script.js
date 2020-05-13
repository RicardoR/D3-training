function initChart() {
  d3.select("svg").remove();

  width = window.innerWidth;
  height = 500;
  margin = { top: 20, right: 30, bottom: 30, left: 40 };

  var svg = d3
    .select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  x = d3
    .scaleLinear()
    .domain([0, 1])
    .range([margin.left, width - margin.right]);

  y = d3
    .scaleLinear()
    .domain([0, 1])
    .range([height - margin.bottom, margin.top]);

  xAxis = (g) =>
    g
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));

  yAxis = (g) =>
    g.attr("transform", `translate(${margin.left},0)`).call(d3.axisLeft(y));

  svg.append("g").call(xAxis);

  svg.append("g").call(yAxis);
}

initChart();

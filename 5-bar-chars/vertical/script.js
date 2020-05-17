var color = "steelblue";
var margin = { top: 30, right: 0, bottom: 30, left: 40 };

var height = 500;
var width = window.innerWidth;

data = [
  { name: "E", value: 0.12702 },
  { name: "T", value: 0.09056 },
  { name: "A", value: 0.08167 },
  { name: "O", value: 0.07507 },
  { name: "I", value: 0.06966 },
  { name: "N", value: 0.06749 },
  { name: "S", value: 0.06327 },
  { name: "H", value: 0.06094 },
  { name: "R", value: 0.05987 },
  { name: "D", value: 0.04253 },
  { name: "L", value: 0.04025 },
  { name: "C", value: 0.02782 },
  { name: "U", value: 0.02758 },
  { name: "M", value: 0.02406 },
  { name: "W", value: 0.0236 },
  { name: "F", value: 0.02288 },
  { name: "G", value: 0.02015 },
  { name: "Y", value: 0.01974 },
  { name: "P", value: 0.01929 },
  { name: "B", value: 0.01492 },
  { name: "V", value: 0.00978 },
  { name: "K", value: 0.00772 },
  { name: "J", value: 0.00153 },
  { name: "X", value: 0.0015 },
  { name: "Q", value: 0.00095 },
  { name: "Z", value: 0.00074 },
];
data.columns = ["letter", "frequency"];
data.format = "%";
data.y = "↑ Frequency";

var x = d3
  .scaleBand()
  .domain(d3.range(data.length))
  .range([margin.left, width - margin.right])
  .padding(0.1);

var y = d3
  .scaleLinear()
  .domain([0, d3.max(data, (d) => d.value)])
  .nice()
  .range([height - margin.bottom, margin.top]);

var xAxis = (g) =>
  g.attr("transform", `translate(0, ${height - margin.bottom})`).call(
    d3
      .axisBottom(x)
      .tickFormat((i) => data[i].name)
      .tickSizeOuter(0)
  );

var yAxis = (g) =>
  g
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(d3.axisLeft(y).ticks(null, data.format))
    .call((g) => g.select(".domain").remove())
    .call((g) =>
      g
        .append("text")
        .attr("x", -margin.left)
        .attr("y", 10)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text(data.y)
    );

var svg = d3
  .select("body")
  .append("svg")
  .attr("viewBox", [0, 0, width, height]);

svg
  .append("g")
  .attr("fill", color)
  .selectAll("rect")
  .data(data)
  .join("rect")
  .attr("x", (d, i) => x(i))
  .attr("y", (d) => y(d.value))
  .attr("height", (d) => y(0) - y(d.value))
  .attr("width", x.bandwidth());

svg.append("g").call(xAxis);

svg.append("g").call(yAxis);

svg.node();

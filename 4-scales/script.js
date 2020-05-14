fruits = [
  { name: "🍊", count: 21 },
  { name: "🍇", count: 13 },
  { name: "🍏", count: 8 },
  { name: "🍌", count: 5 },
  { name: "🍐", count: 3 },
  { name: "🍋", count: 2 },
  { name: "🍎", count: 1 },
  { name: "🍉", count: 1 },
];

width = 640;
height = 202;
margin = { top: 20, right: 0, bottom: 0, left: 30 };

var svg = d3
  .select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

var x = d3
  .scaleLinear()
  .domain([0, d3.max(fruits, (d) => d.count)])
  .range([margin.left, width - margin.right])
  .interpolate(d3.interpolateRound);

var y = d3
  .scaleBand()
  .domain(fruits.map((d) => d.name))
  .range([margin.top, height - margin.bottom])
  .padding(0.1)
  .round(true);

xAxis = (g) =>
  g.attr("transform", `translate(0,${margin.top})`).call(d3.axisTop(x));

yAxis = (g) =>
  g.attr("transform", `translate(${margin.left},0)`).call(d3.axisLeft(y));

svg.append("g").call(xAxis);

svg.append("g").call(yAxis);

var row = svg.selectAll(".row").enter().append("g").attr("class", "row");

var rectangles = svg
  .selectAll("rect")
  .data(fruits)
  .enter()
  .append("g")
  .attr("class", "rect-container")
  .append("rect")
  .attr("x", () => {
    return x(0);
  })
  .attr("y", (d) => {
    return y(d.name);
  })
  .attr("width", (d) => {
    return x(d.count) - x(0);
  })
  .attr("height", y.bandwidth())
  .attr("fill", "steelblue");

var texts = svg
  .selectAll(".rect-container")
  .append("text")
  .attr("x", (d) => {
    return x(d.count);
  })
  .attr("y", (d) => {
    return y(d.name);
  })
  .text((d) => {
    return d.count;
  })
  .attr("transform", `translate(-10, ${y.bandwidth() / 2 + 3})`)
  .attr("text-anchor", "middle")
  .attr("fill", "white")
  .style("font-size", "10px")
  .style("font-family", "sans-serif");

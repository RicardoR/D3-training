var svg = d3.select("svg");
var width = +svg.attr("width");
var height = +svg.attr("height");

var margin = { top: 20, right: 20, bottom: 20, left: 120 };
var innerWidht = width - margin.left - margin.right;
var innerHeight = height - margin.top - margin.bottom;

const render = (data) => {
  console.log(data);
  const xValue = (d) => d.population;
  const yValue = (d) => d.continent;

  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, xValue)])
    .range([0, innerWidht]);

  const yScale = d3
    .scaleBand()
    .padding(0.2)
    .domain(data.map(yValue))
    .range([0, innerHeight]);

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  g.append("g").call(d3.axisLeft(yScale));
  g.append("g")
    .call(d3.axisBottom(xScale))
    .attr("transform", `translate(0, ${innerHeight})`);

  g.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "rects")
    .attr("y", (d) => yScale(yValue(d)))
    .attr("width", (d) => xScale(xValue(d)))
    .attr("height", yScale.bandwidth())
    .on("mouseover", mouseOver)
    .on("mouseleave", mouseLeave);
};

let mouseOver = function (d) {
  d3.selectAll(".rects").transition().duration(200).style("opacity", 0.5);
  d3.select(this).transition().duration(200).style("opacity", 1);
};

let mouseLeave = function (d) {
  d3.selectAll(".rects").transition().duration(200).style("opacity", 1);
  d3.select(this).transition().duration(200);
};

d3.csv("data/data.csv").then((data) => {
  data.forEach((d) => {
    d.population = +d.population;
  });
  render(data);
});

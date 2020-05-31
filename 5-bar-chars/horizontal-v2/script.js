var svg = d3.select("svg");
var width = +svg.attr("width");
var height = +svg.attr("height");

const titleText = "Top 10 Most Populous Countries";
const xAxisLabelText = "Population";
const margin = { top: 50, right: 40, bottom: 77, left: 180 };
var innerWidth = width - margin.left - margin.right;
var innerHeight = height - margin.top - margin.bottom;

const render = (data) => {
  const xValue = (d) => d.population;
  const yValue = (d) => d.continent;

  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, xValue)])
    .range([0, innerWidth]);

  const yScale = d3
    .scaleBand()
    .padding(0.1)
    .domain(data.map(yValue))
    .range([0, innerHeight]);

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const xAxisTickFormat = (number) =>
    d3.format(".3s")(number).replace("G", "B");

  const xAxis = d3
    .axisBottom(xScale)
    .tickFormat(xAxisTickFormat)
    .tickSize(-innerHeight);

  g.append("g")
    .call(d3.axisLeft(yScale))
    .selectAll(".domain, .tick line")
    .remove();

  const xAxisG = g
    .append("g")
    .call(xAxis)
    .attr("transform", `translate(0,${innerHeight})`);

  xAxisG.select(".domain").remove();

  xAxisG
    .append("text")
    .attr("class", "axis-label")
    .attr("y", 65)
    .attr("x", innerWidth / 2)
    .attr("fill", "black")
    .text(xAxisLabelText);

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

  g.append("text").attr("class", "title").attr("y", -10).text(titleText);
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

width = 954;
height = 600;
var data = {};
var edgeColor = "path";
const scaleColor = d3.scaleOrdinal(d3.schemeCategory10);

d3.csv("energy.csv").then((link) => {
  link.forEach((d) => {
    d.value = +d.value;
  });
  const nodes = Array.from(
    new Set(link.flatMap((l) => [l.source, l.target])),
    (name) => ({ name, category: name.replace(/ .*/, "") })
  );

  initChar(nodes, link);
});

function initChar(nodes, links) {
  const svg = d3
    .select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);
  const sankey = d3
    .sankey()
    .nodeId((d) => d.name)
    .nodeWidth(15)
    .nodePadding(10)
    .extent([
      [1, 5],
      [width - 1, height - 5],
    ]);

  ({ nodes, links } = sankey({
    nodes: nodes.map((d) => Object.assign({}, d)),
    links: links.map((d) => Object.assign({}, d)),
  }));

  data.units = "TWh";
  svg
    .append("g")
    .attr("stroke", "#000")
    .selectAll("rect")
    .data(nodes)
    .enter()
    .append("rect")
    .attr("x", (d) => d.x0)
    .attr("y", (d) => d.y0)
    .attr("height", (d) => d.y1 - d.y0)
    .attr("width", (d) => d.x1 - d.x0)
    .attr("fill", color)
    .append("title")
    .text((d) => `${d.name}\n${format(d.value)}`);

  const link = svg
    .append("g")
    .attr("fill", "none")
    .attr("stroke-opacity", 0.5)
    .selectAll("g")
    .data(links)
    .enter()
    .append("g")
    .style("mix-blend-mode", "multiply");

  link
    .append("path")
    .attr("d", d3.sankeyLinkHorizontal())
    .attr("stroke", (d) => color(d.target))
    .attr("stroke-width", (d) => Math.max(1, d.width));

  link
    .append("title")
    .text((d) => `${d.source.name} → ${d.target.name}\n${format(d.value)}`);

  svg
    .append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .attr("x", (d) => (d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6))
    .attr("y", (d) => (d.y1 + d.y0) / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", (d) => (d.x0 < width / 2 ? "start" : "end"))
    .text((d) => d.name);
}

function color(d) {
  return scaleColor(d.category === undefined ? d.name : d.category);
}

function format(d) {
  const format = d3.format(",.0f");
  return data.units ? `${format(d)} ${data.units}` : format;
}

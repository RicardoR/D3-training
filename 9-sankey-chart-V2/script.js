var data = {};

const margin = { top: 10, right: 100, bottom: 10, left: 100 },
  width = 954 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;

const edgeColor = "path";
const opacityOnHover = "0.5";
const defaultOpacity = "0.2";
const nodeValueMargin = 20;
const nodeTextMargin = 3;
const nodeFontSize = 10;
const nodeDYvalue = "0.35em";

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
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
    .attr("class", "node")
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
    .on("mouseover", (node) =>
      d3
        .select(`#value-node-id-${node.index}`)
        .classed("hide-node-values", false)
    )
    .on("mouseleave", (node) =>
      d3
        .select(`#value-node-id-${node.index}`)
        .classed("hide-node-values", true)
    )
    .append("title")
    .text((d) => `${d.name}\n${format(d.value)}`);

  const link = svg
    .append("g")
    .attr("fill", "none")
    .selectAll("g")
    .data(links)
    .enter()
    .append("g")
    .attr("class", "link")
    .attr("id", (d) => `link-${d.index}`)
    .style("mix-blend-mode", "multiply");

  link
    .append("path")
    .attr("d", d3.sankeyLinkHorizontal())
    .attr("stroke", (d) => color(d.target))
    .attr("stroke-width", (d) => Math.max(1, d.width));

  link
    .on("mouseover", (l) => highlightLink(l.index, opacityOnHover))
    .on("mouseleave", (l) => highlightLink(l.index, defaultOpacity));

  link
    .append("title")
    .text((d) => `${d.source.name} → ${d.target.name}\n${format(d.value)}`);

  svg
    .append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", nodeFontSize)
    .selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .attr("x", (d) =>
      d.x0 < width / 2 ? d.x1 + nodeTextMargin : d.x0 - nodeTextMargin
    )
    .attr("y", (d) => (d.y1 + d.y0) / 2)
    .attr("dy", nodeDYvalue)
    .attr("text-anchor", (d) => (d.x0 < width / 2 ? "start" : "end"))
    .text((d) => d.name);

  svg
    .append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", nodeFontSize)
    .selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .attr("x", (d) =>
      d.x0 < width / 2 ? d.x1 - nodeValueMargin : d.x0 + nodeValueMargin
    )
    .attr("y", (d) => (d.y1 + d.y0) / 2)
    .attr("dy", nodeDYvalue)
    .attr("text-anchor", (d) => (d.x0 < width / 2 ? "end" : "start"))
    .text((d) => format(d.value))
    .attr("class", "hide-node-values")
    .attr("id", (d) => `value-node-id-${d.index}`);
}

function color(d) {
  return scaleColor(d.category === undefined ? d.name : d.category);
}

function format(d) {
  const format = d3.format(",.0f");
  return data.units ? `${format(d)} ${data.units}` : format;
}

function highlightLink(id, opacity) {
  d3.select("#link-" + id).style("stroke-opacity", opacity);
}

const colorScale = d3
  .scaleOrdinal()
  .domain(["apple", "lemon"])
  .range(["#c11d1d", "#eae600"]);

const radiusScale = d3
  .scaleOrdinal()
  .domain(["apple", "lemon"])
  .range([80, 50]);

const fruitBowl = (selection, props) => {
  const { fruits, height } = props;

  selection
    .selectAll("rect")
    .data([null])
    .enter()
    .append("rect")
    .attr("y", 110)
    .attr("width", 920)
    .attr("height", 300)
    .attr("rx", 300 / 2);

  const groups = selection.selectAll("g").data(fruits);
  const groupsEnter = groups.enter().append("g");

  //http://vis.stanford.edu/files/2011-D3-InfoVis.pdf
  // UPDATE: the groups itself (data join) is the update, so we can change the attrs for new data
  // MERGE: combine attributes from enter and update, doing this we dont have to duplicate
  // the attrs set in the enter selection will never change
  groupsEnter
    .merge(groups)
    .attr("transform", (d, i) => `translate(${i * 180 + 100},${height / 2})`);

  // EXIT: we are selecting the data wich wont exist anymore, we can change the styles or remove
  // groups.exit().attr("fill", "white")
  groups.exit().remove();

  groupsEnter
    .append("circle")
    .merge(groups.select("circle"))
    .attr("r", (d) => radiusScale(d.type))
    .attr("fill", (d) => colorScale(d.type));

  groupsEnter
    .append("text")
    .merge(groups.select("text"))
    .text((d) => d.type)
    .attr("y", 120);
};

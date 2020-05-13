function gridBigData() {
  let data = new Array();
  let xpos = 1;
  let ypos = 1;
  let width = 10;
  let height = 10;
  let click = 0;

  for (let row = 0; row < 90; row++) {
    data.push(new Array());
    for (let colum = 0; colum < 90; colum++) {
      data[row].push({
        x: xpos,
        y: ypos,
        width: width,
        height: height,
        click: click,
      });
      xpos += width;
    }
    xpos = 1;
    ypos += height;
  }
  return data;
}

var gridBigData = gridBigData();
console.log("gridBigData...", gridBigData);

var gridBig = d3
  .select("body")
  .append("svg")
  .attr("width", "902")
  .attr("height", "902");

var rowBig = gridBig
  .selectAll(".big-row")
  .data(gridBigData)
  .enter()
  .append("g")
  .attr("class", "big-row");

var columnBig = rowBig
  .selectAll("square-small")
  .data((d) => {
    return d;
  })
  .enter()
  .append("rect")
  .attr("class", "square-small")
  .attr("x", (d) => {
    return d.x;
  })
  .attr("y", (d) => {
    return d.y;
  })
  .attr("width", (d) => {
    return d.width;
  })
  .attr("height", (d) => {
    return d.height;
  })
  .style("fill", "#fff")
  .style("stroke", "#222")
  .on("mouseover", function (d) {
    d.click++;
    if (d.click % 4 == 0) {
      d3.select(this).style("fill", "#fff");
    }
    if (d.click % 4 == 1) {
      d3.select(this).style("fill", "#2C93E8");
    }
    if (d.click % 4 == 2) {
      d3.select(this).style("fill", "#F56C4E");
    }
    if (d.click % 4 == 3) {
      d3.select(this).style("fill", "#838690");
    }
  });

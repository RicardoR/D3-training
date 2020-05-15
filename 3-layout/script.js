function gridData() {
  var data = new Array();
  var xpos = 1;
  var ypos = 1;
  var width = 50;
  var height = 50;
  var click = 0;

  for (let row = 0; row < 10; row++) {
    data.push(new Array());
    for (let column = 0; column < 10; column++) {
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
  // 2 dimensions array 10 x 10
}

var gridData = gridData();
console.log("gridData...", gridData);

var grid = d3
  .select("body")
  .append("svg")
  .attr("width", "510")
  .attr("height", "510");

var row = grid
  .selectAll(".row")
  .data(gridData)
  .enter()
  .append("g")
  .attr("class", "row");

var column = row
  .selectAll(".square")
  .data((d) => {
    // return the data stored on each row == > array with 10 elements
    console.log(d);
    return d;
  })
  .enter()
  .append("rect")
  .attr("class", "square")
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
  // click change mechanism: 1st => blue, 2nd => orange, 3rd => grey, 4th => white:
  .on("click", function (d) {
    console.log("click");
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
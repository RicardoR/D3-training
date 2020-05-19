/*
 *    main.js
 *    Mastering Data Visualization with D3.js
 *    2.8 - Activity: Your first visualization!
 */

d3.json("data/buildings.json")
  .then((data) => {
    data.forEach((element) => {
      element.height = +element.height;
    });

    console.log(data);
    var svg = d3
      .select("#chart-area")
      .append("svg")
      .attr("width", 500)
      .attr("height", 500);

    var rectangles = svg.selectAll("rect").data(data);
    var width = 50;

    rectangles
      .enter()
      .append("rect")
      .attr("width", width)
      .attr("height", (d) => d.height)
      .attr("x", (d, i) => width + i * width * 1.2)
      .attr("y", 50)
      .attr("fill", "steelblue")
      .attr("stroke-width", 2)
      .attr("stroke", "black");
  })
  .catch((err) => {
    console.error(err);
  });

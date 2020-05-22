/*
 *    main.js
 *    Mastering Data Visualization with D3.js
 *    Project 1 - Star Break Coffee
 */

d3.json("data/revenues.json")
  .then((data) => {
    data.forEach((element) => {
      element.profit = +element.profit;
      element.revenue = +element.revenue;
    });

    console.log("data", data);

    var margin = { left: 80, right: 20, top: 10, bottom: 60 };
    var width = 600 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    const svg = d3
      .select("#chart-area")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

    var x = d3
      .scaleBand()
      .domain(
        data.map(function (d) {
          return d.month;
        })
      )
      .range([0, width])
      .paddingInner(0.3)
      .paddingOuter(0.3);

    var y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, function (d) {
          return d.revenue;
        }),
      ])
      .range([height, 0]);

    console.log("x(January) =>", x("January"));
    console.log("x(July) =>", x("July"));
    console.log("y(0)", y(0));

    var xAxisCall = d3.axisBottom(x);
    var yAxisCall = d3.axisLeft(y).tickFormat(function (d) {
      return "$" + d;
    });

    svg
      .append("g")
      .attr("class", "bottom-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxisCall);

    svg.append("g").attr("class", "left-axis").call(yAxisCall);

    svg
      .append("text")
      .attr("class", "y-axis-label")
      .attr("x", -height / 2)
      .attr("y", -margin.left / 1.4)
      .attr("font-size", "20px")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .text("Revenue");

    svg
      .append("text")
      .attr("class", "x-axis-label")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 10)
      .attr("font-size", "20px")
      .attr("text-anchor", "middle")
      .text("Month");
    var rects = svg.selectAll("rect").data(data);

    rects
      .enter()
      .append("rect")
      .attr("y", function (data) {
        return y(data.revenue);
      })
      .attr("x", function (data) {
        return x(data.month);
      })
      .attr("height", function (data) {
        return height - y(data.revenue);
      })
      .attr("width", x.bandwidth())
      .attr("fill", "steelblue")
      .attr("stroke-width", 0.5)
      .attr("stroke", "black");
  })
  .catch((err) => {
    console.error("err", err);
  });

/*
 *    main.js
 *    Mastering Data Visualization with D3.js
 *    Project 2 - Gapminder Clone
 */

// Write scales for each axis (GDP-per-capita on the x-axis, life expectancy on the y-axis)
var margin = { left: 80, right: 20, top: 50, bottom: 100 };
var width = 800 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

var dataIndex = 0;

var svg = d3
  .select("#chart-area")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left}+${margin.top})`);

var x = d3.scaleLog().base(10).range([0, width]).domain([142, 150000]);
var y = d3.scaleLinear().range([height, 0]).domain([0, 90]);

var area = d3
  .scaleLinear()
  .range([25 * Math.PI, 1500 * Math.PI])
  .domain([2000, 1400000000]);

var continentColor = d3.scaleOrdinal(d3.schemePastel1);

var xAxisCall = d3
  .axisBottom(x)
  .tickValues([400, 4000, 40000])
  .tickFormat(d3.format("$"));

var yAxisCall = d3.axisLeft(y);

svg
  .append("g")
  .attr("class", "bottom-axis")
  .attr("transform", `translate(0, ${height})`)
  .call(xAxisCall);

svg.append("g").attr("class", "left-axis").call(yAxisCall);

svg
  .append("text")
  .attr("class", "y-axis-label")
  .attr("x", -height / 2)
  .attr("y", -margin.left + 40)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")
  .text("Life Expectancy (Years)");

svg
  .append("text")
  .attr("class", "x-axis-label")
  .attr("x", width / 2)
  .attr("y", height + margin.bottom - 50)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("GDP Per Capita ($)");

var yearsLabel = svg
  .append("text")
  .attr("class", "label-x-axis")
  .attr("x", width - 40)
  .attr("y", height - 10)
  .attr("font-size", "40px")
  .attr("opacity", "0.4")
  .attr("text-anchor", "middle")
  .text("1800");

d3.json("data/data.json").then(function (data) {
  console.log(data);
  const dataCleaned = cleanData(data);
  console.log(dataCleaned);
  const arrayLength = dataCleaned.length - 1;

  createContinentsLeyend(dataCleaned);

  d3.interval(function () {
    dataIndex = dataIndex < arrayLength ? dataIndex + 1 : 0;
    update(dataCleaned[dataIndex]);
  }, 100);

  update(dataCleaned[dataIndex]);
});

function cleanData(data) {
  return data.map((data) => {
    return data["countries"]
      .filter((country) => {
        var countryData = country.income && country.life_exp;
        return countryData;
      })
      .map(function (country) {
        country.income = +country.income;
        country.life_exp = +country.life_exp;
        return country;
      });
  });
}

function update(data) {
  var t = d3.transition().duration(100);

  // 1.- Join new data with old elements
  var circles = svg.selectAll("circle").data(data, function (d) {
    return d.country;
  });

  // with this circles go more quick why?
  // var circles = svg.selectAll("circle").data(data);

  // 2.- Exit old elements not represent in new data
  circles.exit().attr("class", "exit").remove();

  // 3.-  Enter new Elements present in new data
  circles
    .enter()
    .append("circle")
    .attr("class", "enter")
    .attr("fill", (d) => continentColor(d.continent))
    .merge(circles)
    .transition(t)
    .attr("cx", (d) => x(d.income))
    .attr("cy", (d) => y(d.life_exp))
    .attr("r", (d) => Math.sqrt(area(d.population) / Math.PI));

  yearsLabel.text(dataIndex + 1800);
}

function createContinentsLeyend(data) {
  const continentList = [];
  data.map((item) => {
    item.map((data) => {
      if (continentList.indexOf(data.continent) === -1) {
        continentList.push(data.continent);
      }
    });
  });

  var leyend = svg
    .append("g")
    .attr("transform", `translate(${width - 10}, ${height - 125})`);

  continentList.forEach((continent, i) => {
    var leyendRow = leyend
      .append("g")
      .attr("transform", `translate(0, ${i * 20})`);

    leyendRow
      .append("rect")
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", continentColor(continent));

    leyendRow
      .append("text")
      .attr("x", -10)
      .attr("y", 10)
      .attr("text-anchor", "end")
      .style("text-transform", "capitalize")
      .text(continent);
  });
}

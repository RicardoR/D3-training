var w = 500;
var h = 500;
var dataset = [5, 10, 15, 20, 25];

var svg = d3.select('body').append('svg').attr('widht', w).attr('height', h);
var circles = svg.selectAll('circle').data(dataset).enter().append('circle');

// Define circles position
circles
  .attr('cx', (d, i) => {
    return i * 50 + 25; // d = dataset i = index => in that order
  })
  .attr('cy', h / 2)
  .attr('r', (d) => {
    return d; // d = dataset
  });

// Define circles colours
circles
  .attr('fill', 'yellow')
  .attr('stroke', 'orange')
  .attr('stroke-width', (d) => {
    return d;
  });

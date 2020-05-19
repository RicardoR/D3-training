/*
*    main.js
*    Mastering Data Visualization with D3.js
*    2.5 - Activity: Adding SVGs to the screen
*/

var svg = d3.select('#chart-area')
.append('svg')
.attr('width', 500)
.attr('height', 400);


svg.append('line')
.attr('x1', 10)
.attr('y1', 3)
.attr('x2', 210)
.attr('y2', 3)
.attr("stroke-width", 2)
.attr("stroke", "black");

svg.append('rect')
.attr('width', 200)
.attr('height', 100)
.attr('x', 10)
.attr('y', 50)
.attr("fill", 'steelblue')
.attr("stroke-width", 2)
.attr("stroke", "black");

svg.append('ellipse')
.attr('cx', 110)
.attr('cy', 260)
.attr('rx', 100)
.attr('ry', 50)
.attr('fill', 'steelblue')
.attr('stroke', 'black')
.attr('stroke-width', '2')

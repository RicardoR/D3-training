var w = 500;
var h = 500;
var data0 = [
  { gpa: 3.42, height: 138 },
  { gpa: 3.54, height: 153 },
  { gpa: 3.14, height: 148 },
  { gpa: 2.76, height: 164 },
  { gpa: 2.95, height: 162 },
  { gpa: 3.36, height: 143 },
];

var data1 = [
  { gpa: 3.15, height: 157 },
  { gpa: 3.12, height: 175 },
  { gpa: 3.67, height: 167 },
  { gpa: 3.85, height: 149 },
  { gpa: 2.32, height: 165 },
  { gpa: 3.01, height: 171 },
  { gpa: 3.54, height: 168 },
  { gpa: 2.89, height: 180 },
  { gpa: 3.75, height: 153 },
];

// One dummy circle
// =========================================================================
// =========================================================================
var svg = d3
  .select('body')
  .append('svg')
  .attr('width', 100)
  .attr('height', 100);
var circles = svg.append('circle');
circles.attr('cx', 50).attr('cy', 50).attr('r', 5).attr('fill', 'grey');

// Bindind data ============================================================
// =========================================================================
// =========================================================================

var svgBinded = d3
  .select('body')
  .append('svg')
  .attr('width', w)
  .attr('height', h);

var circlesWithData = svgBinded
  .selectAll('circles')
  .data(data0)
  .enter()
  .append('circle')
  .attr('cx', (d, i) => {
    return 25 + 50 * i;
  })
  .attr('cy', (d, i) => {
    return 25 + 50 * i;
  })
  .attr('r', 5)
  .attr('fill', grey);

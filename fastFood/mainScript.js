var heatMap = d3.select('#heat-map').append('svg').attr('x', 60);

var companies = ['burgerKing', 'mcDonalds', 'wendys', 'whiteCastle'];

var categories = ['burgers', 'breakfast', 'sides', 'salads', 'desserts'];

var FastFoodDataCount;
var selectedCategory = "Burgers/Sandwiches";

// place company logos for heat map
companies.forEach(function(d, index) {
  // company logo
  heatMap.append('image')
  .attr('xlink:href', './img/' + d + '_icon.svg')
  .attr('height', 70)
  .attr('width', 70)
  .attr('x', 118 + 132*(index) + 25);
  // colored bars
  heatMap.append('rect')
  .attr('x', 118 + 132*(index))
  .attr('y', 70 + 24)
  .attr('fill', '#FF0000')
  .attr('height', 12)
  .attr('width', 120);
});

// place food categories for heat map
categories.forEach(function(d, index) {
  // category icons
  heatMap.append('image')
  .attr('xlink:href', './img/' + d + '_icon.png')
  .attr('y', 118 + 132*index + 25)
  .attr('height', 70)
  .attr('width', 70)
  // colored bars
  heatMap.append('rect')
  .attr('x', 94)
  .attr('y', 118 + 132*index)
  .attr('fill', '#005499')
  .attr('height', 120)
  .attr('width', 12);
});

// read the fast food data counts
d3.csv('./data/FastFoodDataCount.csv', function(error, data) {
  FastFoodDataCount = data;

  // create IDs for data
  FastFoodDataCount.forEach(function(d) {
    d['id'] = categories.indexOf(d['Meal']) + '' + companies.indexOf(d['Restaurant']);
  });

  // create placeholders boxes for heat map
  categories.forEach(function(category, i) {
    companies.forEach(function(company, j) {
      heatMap.append('rect')
      .attr('x', 118 + 132*j)
      .attr('y', 118 + 132*i)
      .attr('height', 120)
      .attr('width', 120)
      .attr('fill', 'gray')
      .attr('id', 'ID' + i + '' + j);
    });
  });

  // fill heat map with frquency and color
  FastFoodDataCount.forEach(function(d) {
    var gridID = d['id'];
    heatMap.append('text')
    .text(d['Count'])
    .attr('x', 118 + 132*gridID[1] + 80)
    .attr('y', 118 + 132*gridID[0] + 105)
    .style('font-size', 24)
    .style('fill', '#F0002F')
    .style('font-family', 'Open Sans')
    .style('font-weight', 600);
    d3.select('#ID' + gridID)
    .attr('fill', function() {
      if (d['Count'] < 20) {
        return '#FFF9E7';
      } else if (d['Count'] < 40) {
        return '#FFDB6B';
      } else {
        return '#D2A20B';
      }
    });
  });
});

// create heat map key
heatMap.append('rect')
.attr('x', 118 + (132*3) + 58)
.attr('y', 778)
.attr('width', 62)
.attr('height', 42)
.attr('fill', '#D2A20B')
.attr('stroke-width', 1)
.attr('stroke', 'black');

heatMap.append('text')
.text('high')
.attr('x', 118 + (132*3) + 58)
.attr('y', 778 + 74)
.attr('color', '#202020')
.style('font-family', 'Open Sans')
.style('font-weight', 300)
.style('font-size', 20);

heatMap.append('text')
.text('variety')
.attr('x', 118 + (132*3) + 58)
.attr('y', 778 + 100)
.attr('color', '#202020')
.style('font-family', 'Open Sans')
.style('font-weight', 300)
.style('font-size', 20);

heatMap.append('text')
.text('med')
.attr('x', 118 + (132*3) - 45)
.attr('y', 778 + 74)
.attr('color', '#202020')
.style('font-family', 'Open Sans')
.style('font-weight', 300)
.style('font-size', 20);

heatMap.append('text')
.text('variety')
.attr('x', 118 + (132*3) - 45)
.attr('y', 778 + 100)
.attr('color', '#202020')
.style('font-family', 'Open Sans')
.style('font-weight', 300)
.style('font-size', 20);

heatMap.append('text')
.text('low')
.attr('x', 118 + (132*3) - 148)
.attr('y', 778 + 74)
.attr('color', '#202020')
.style('font-family', 'Open Sans')
.style('font-weight', 300)
.style('font-size', 20);

heatMap.append('text')
.text('variety')
.attr('x', 118 + (132*3) - 148)
.attr('y', 778 + 100)
.attr('color', '#202020')
.style('font-family', 'Open Sans')
.style('font-weight', 300)
.style('font-size', 20);

heatMap.append('rect')
.attr('x', 118 + (132*3) - 44)
.attr('y', 778)
.attr('width', 62)
.attr('height', 42)
.attr('fill', '#FFDB6B')
.attr('stroke-width', 1)
.attr('stroke', 'black');

heatMap.append('rect')
.attr('x', 118 + (132*3) - 146)
.attr('y', 778)
.attr('width', 62)
.attr('height', 42)
.attr('fill', '#FFF9E7')
.attr('stroke-width', 1)
.attr('stroke', 'black');

// create pick a category sidebar
d3.select('#side-bar')
.append('text')
.text('Pick')
.attr('text-anchor', 'middle')
.style('fill', 'black')
.attr('x', 136)
.attr('y', 94)
.style('font-family', 'Open Sans')
.style('font-size', 55)
.style('font-weight', 700);

d3.select('#side-bar')
.append('text')
.text('a')
.attr('text-anchor', 'middle')
.style('fill', 'black')
.attr('x', 65)
.attr('y', 129)
.style('font-family', 'Open Sans')
.style('font-size', 30)
.style('font-weight', 300);

d3.select('#side-bar')
.append('text')
.text('Category')
.attr('text-anchor', 'middle')
.style('fill', '#202020')
.attr('x', 149)
.attr('y', 129)
.style('font-family', 'Open Sans')
.style('font-size', 30)
.style('font-weight', 700);

d3.select('#side-bar')
.append('svg')
.attr('class', 'category-selector')
.attr('id', 'category-burger')
.append('image')
.attr('xlink:href', './img/burgers_icon.png')
.attr('x', 100)
.attr('y', 148)
.attr('width', 70)
.attr('height', 70);

d3.select('#category-burger')
.append('text')
.text('Burgers / Sandwiches')
.style('fill', '#646464')
.attr('x', 136)
.attr('y', 244)
.attr('text-anchor', 'middle')
.style('font-family', 'Open Sans')
.style('font-size', 20);

d3.select('#side-bar')
.append('svg')
.attr('class', 'category-selector')
.attr('id', 'category-breakfast')
.append('image')
.attr('xlink:href', './img/breakfast_icon.png')
.attr('x', 100)
.attr('y', 274)
.attr('width', 70)
.attr('height', 70);

d3.select('#category-breakfast')
.append('text')
.text('Breakfast')
.style('fill', '#646464')
.attr('x', 136)
.attr('y', 370)
.attr('text-anchor', 'middle')
.style('font-family', 'Open Sans')
.style('font-size', 20);

d3.select('#side-bar')
.append('svg')
.attr('class', 'category-selector')
.attr('id', 'category-sides')
.append('image')
.attr('xlink:href', './img/sides_icon.png')
.attr('x', 100)
.attr('y', 400)
.attr('width', 70)
.attr('height', 70);

d3.select('#category-sides')
.append('text')
.text('Sides')
.style('fill', '#646464')
.attr('x', 136)
.attr('y', 496)
.attr('text-anchor', 'middle')
.style('font-family', 'Open Sans')
.style('font-size', 20);

d3.select('#side-bar')
.append('svg')
.attr('class', 'category-selector')
.attr('id', 'category-salads')
.append('image')
.attr('xlink:href', './img/salads_icon.png')
.attr('x', 100)
.attr('y', 526)
.attr('width', 70)
.attr('height', 70);

d3.select('#category-sides')
.append('text')
.text('Salads')
.style('fill', '#646464')
.attr('x', 136)
.attr('y', 622)
.attr('text-anchor', 'middle')
.style('font-family', 'Open Sans')
.style('font-size', 20);

d3.select('#side-bar')
.append('svg')
.attr('class', 'category-selector')
.attr('id', 'category-desserts')
.append('image')
.attr('xlink:href', './img/desserts_icon.png')
.attr('x', 100)
.attr('y', 652)
.attr('width', 70)
.attr('height', 70);

d3.select('#category-desserts')
.append('text')
.text('Desserts')
.style('fill', '#646464')
.attr('x', 136)
.attr('y', 748)
.attr('text-anchor', 'middle')
.style('font-family', 'Open Sans')
.style('font-size', 20);

//Pick a category button implementation
d3.select("#category-burger")
  .append("rect")
  .attr("id","hover-burger")
  .attr("x", 35)
  .attr("y", 138)
  .attr('width', 200)
  .attr('height', 120)
  .attr("fill", "gray")
  .attr("opacity", 0)
.on("mouseover",function(){
  d3.select("#hover-burger").attr("opacity", 0.3);
})
.on("mouseout",function(){
  d3.select("#hover-burger").attr("opacity", 0);
})
.on("click", function(){
  selectedCategory = "Burgers/Sandwiches";
  d3.selectAll(".hover-restaurants").style("stroke-width", 0);
  updateCategory("Burgers/Sandwiches", "none");
});

d3.select("#category-breakfast")
  .append("rect")
  .attr("id","hover-breakfast")
  .attr("x", 35)
  .attr("y", 264)
  .attr('width', 200)
  .attr('height', 120)
  .attr("fill", "gray")
  .attr("opacity", 0)
.on("mouseover",function(){
  d3.select("#hover-breakfast").attr("opacity", 0.3);
})
.on("mouseout",function(){
  d3.select("#hover-breakfast").attr("opacity", 0);
})
.on("click", function(){
  selectedCategory = "Breakfast";
  d3.selectAll(".hover-restaurants").style("stroke-width", 0);
  updateCategory("Breakfast", "none");
});

d3.select("#category-sides")
  .append("rect")
  .attr("id","hover-sides")
  .attr("x", 35)
  .attr("y", 390)
  .attr('width', 200)
  .attr('height', 120)
  .attr("fill", "gray")
  .attr("opacity", 0)
.on("mouseover",function(){
  d3.select("#hover-sides").attr("opacity", 0.3);
})
.on("mouseout",function(){
  d3.select("#hover-sides").attr("opacity", 0);
})
.on("click", function(){
  selectedCategory = "Side";
  d3.selectAll(".hover-restaurants").style("stroke-width", 0);
  updateCategory("Side", "none");
});

d3.select("#category-salads")
  .append("rect")
  .attr("id","hover-salads")
  .attr("x", 35)
  .attr("y", 516)
  .attr('width', 200)
  .attr('height', 120)
  .attr("fill", "gray")
  .attr("opacity", 0)
.on("mouseover",function(){
  d3.select("#hover-salads").attr("opacity", 0.3);
})
.on("mouseout",function(){
  d3.select("#hover-salads").attr("opacity", 0);
})
.on("click", function(){
  selectedCategory = "Salad";
  d3.selectAll(".hover-restaurants").style("stroke-width", 0);
  updateCategory("Salad", "none");
});

d3.select("#category-desserts")
  .append("rect")
  .attr("id","hover-desserts")
  .attr("x", 35)
  .attr("y", 642)
  .attr('width', 200)
  .attr('height', 120)
  .attr("fill", "gray")
  .attr("opacity", 0)
.on("mouseover",function(){
  d3.select("#hover-desserts").attr("opacity", 0.3);
})
.on("mouseout",function(){
  d3.select("#hover-desserts").attr("opacity", 0);
})
.on("click", function(){
  selectedCategory = "Dessert";
  d3.selectAll(".hover-restaurants").style("stroke-width", 0);
  updateCategory("Dessert", "none");
});

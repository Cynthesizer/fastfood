//Create a SVG for the scatterPlot
var svgWidth = 400;
var screenWidth = 1024;
var screenHeight = 1270;
var itemInfoWidth = screenHeight-svgWidth*2;
var imageWidth = 90;
var defaultVal = 1;
var svg2 = d3.select("#scatterPlot")
    .append("svg")
    .attr("width", svgWidth*2)
    .attr("height", svgWidth*2);

//Create a SVG for the side tooltip
var svg3 = d3.select("#itemBox")
    .append("svg")
    .attr("width", itemInfoWidth+5)
    .attr("height", svgWidth*2);

//Create a SVG for graph title
var svg4 = d3.select("#graph-title")
    .append("svg")
    .attr("width", screenWidth)
    .attr("height", svgWidth);

svg4.append('text')
.text('Pick')
.style('fill', '#202020')
.attr('x', 15)
.attr('y', 300)
.style('font-family', 'Open Sans')
.style('font-weight', 700)
.style('font-size', 55);

svg4.append('text')
.text('a')
.style('fill', '#202020')
.attr('x', 145)
.attr('y', 300)
.style('font-family', 'Open Sans')
.style('font-weight', 300)
.style('font-size', 40);

svg4.append('text')
.text('Restaurant')
.style('fill', '#202020')
.attr('x', 15)
.attr('y', 335)
.style('font-family', 'Open Sans')
.style('font-weight', 700)
.style('font-size', 35);

//Parse the data
function parseLine(line) {
    line.Restaurant = String(line.Restaurant);
    line.Meal = String(line.Meal);
    line.MealType = String(line.MealType);
    line.ItemName = String(line.ItemName);
    line.Calories = Number(line.Calories);
    line.Protein = Number(line.Protein);
    line.TotalFat = Number(line.TotalFat);
    line.TotalCarbs = Number(line.TotalCarbs);
    line.Sodium = Number(line.Sodium);
    line.SaturatedFat = Number(line.SaturatedFat);
    line.TransFat = Number(line.TransFat);
    line.Cholesterol = Number(line.Cholesterol);
    line.Fiber = Number(line.Fiber);
    line.Sugar = Number(line.Sugar);
    return line;
}

  // adding data from FastFoodData.csv
d3.csv("./data/FastFoodData.csv", parseLine, function(error, data){
    foodData = data;
    //Default display set to Burgers/Sandwiches
    displayCategory("Burgers/Sandwiches","none");
    displayScatterPlot("Burgers/Sandwiches", "none" ,foodData, "Calories", "Total Fat",1);
});

// Arrays storing colors, info, and images
var color_list = {"Burger King": '#005499',
                  "McDonald's": '#FCD933',
                  "Wendy's": '#F1002F',
                  "White Castle": '#FF9F00'
                };

var category_list = {"all": 'Burgers & Sandwiches',
                  "Burgers/Sandwiches": 'Burgers & Sandwiches',
                  "Breakfast": 'Breakfast',
                  "Side": 'Sides',
                  "Salad": 'Salads',
                  "Dessert": 'Desserts'
                };

var restaurant_img = {"Burger King": 'img/burgerKing_icon.svg',
                  "McDonald's": 'img/mcDonalds_icon.svg',
                  "Wendy's": 'img/wendys_icon.svg',
                  "White Castle": 'img/whiteCastle_icon.svg'
                };

var category_img = {"all": 'img/burgers_icon.png',
                  "Burgers/Sandwiches": 'img/burgers_icon.png',
                  "Breakfast": 'img/breakfast_icon.png',
                  "Side": 'img/sides_icon.png',
                  "Salad": 'img/salads_icon.png',
                  "Dessert": 'img/desserts_icon.png'
                };

function displayScatterPlot(selectedMeal, selectedRestaurant, enterData, xAxis, yAxis, initialize) {
  var plotWidth = svgWidth*5/4;
  var plotHeight = svgWidth*5/4;
  var opacity = 0.75;
  var radius = plotWidth/60;
  //Amount of radius increased when user hovers over circle
  var radiusFactor = 4;
  var img;
  //Filter data to only show the ones for selected meal
  if(selectedMeal == "all"){
    filteredData = enterData;
  }else if(selectedRestaurant == "none"){
    filteredData = enterData.filter(function(d){
      if(d.Meal == selectedMeal){
        return d;
      }
    });
  }else{
    filteredData = enterData.filter(function(d){
      if(d.Meal == selectedMeal && d.Restaurant == selectedRestaurant){
        return d;
      }
    });
  }

  //Create default point in the dataset to display when page is loaded
  var defaultIndex = Math.floor(filteredData.length*0.85);

  var xPadding = 40;
  var yPadding = 100;
  var xMax = d3.max(filteredData, function(d){
    return d.Calories;
  }) + 5;
  var yMax = d3.max(filteredData, function(d){
    return d.TotalFat;
  }) + 10;
  var xScale = d3.scaleLinear().domain([0,xMax]).range([0, plotWidth]);
  var yScale = d3.scaleLinear().domain([0,yMax]).range([plotHeight, 0]);

  // The first time to draw the scatter plot
  if (initialize==1){
    //Plot title
    svg2.append("text")
    .attr("id","plotTitle")
    .attr("x", plotWidth/2-xPadding-10)
    .attr("y", yPadding-10)
    .text("Nutrition Facts");

    //Item Box Title
    svg3.append("text")
    .attr("id","itemBoxTitle")
    .attr("x", itemInfoWidth/4)
    .attr("y", yPadding-15)
    .text("Current Selection:");

    //X-axis, Y-axis
    svg2.append("g").call(d3.axisBottom(xScale)).attr('class','axes').attr("fill","#005499").attr("transform", "translate("+ (xPadding*1.5) + "," + (plotHeight+yPadding) + ")");
    svg2.append("g").call(d3.axisLeft(yScale)).attr('class','axes').attr("fill","#005499").attr("transform", "translate("+ (xPadding*1.5) + "," + (yPadding) + ")");

    //X-axis label
    svg2.append("text")
      .attr("class","axis-labels")
      .attr("id","x-axis")
      .attr("x", plotWidth/2+xPadding-20)
      .attr("y", plotHeight+yPadding+45);
    //Y-axis label
    svg2.append("text")
      .attr("class","axis-labels")
      .attr("id","y-axis")
      .attr("transform", "rotate(270)")
      .attr("x", -plotWidth/2-1.5*yPadding)
      .attr("y", xPadding-10);

    //Correlation line
    svg2.append("line")
    .attr("class", "divider")
    .attr("x1", xScale(xMax)+3*xPadding)
    .attr("y1", yScale(yMax)+yPadding)
    .attr("x2", xScale(xMax)+3*xPadding)
    .attr("y2", yScale(0)+yPadding)
    .style("stroke", "black");

    svg2.selectAll("circle").data(filteredData).enter().append("circle");

  }else{
    //Remove all exta circles, add extra circles needed
    svg2.selectAll("circle").data(filteredData).exit().remove();
    svg2.selectAll("circle").data(filteredData).enter().append("circle");
    //Remove preexisting info
    svg3.selectAll(".itemInfo").remove();
    svg4.selectAll(".categoryInfo").remove();

    //Update X-axis, Y-axis
    svg2.selectAll('.axes').remove();
    svg2.append("g").call(d3.axisBottom(xScale)).attr('class','axes').attr("fill","#005499").attr("transform", "translate("+ (xPadding*1.5) + "," + (plotHeight+yPadding) + ")");
    svg2.append("g").call(d3.axisLeft(yScale)).attr('class','axes').attr("fill","#005499").attr("transform", "translate("+ (xPadding*1.5) + "," + (yPadding) + ")");

  }

  // Add text of x and y axis.
  d3.selectAll("#x-axis")
    .text(xAxis);
  d3.selectAll("#y-axis")
    .text(yAxis);
  //Initialize fields for tooltip
  attributeHeight = 150;
  attributeGap = 40;
  var itemImage = svg3.append("svg:image").attr('class','itemInfo')
                  .attr("x", plotWidth/4 + plotWidth/8)
                  .attr("y", plotWidth/4 -20 )
                  .attr('height', plotWidth/4)
                  .attr('width', plotWidth/4);
  var itemName = svg3.append("text").attr('id','itemName').attr('class','itemInfo')
                  .attr("x", plotWidth/10)
                  .attr("y", plotHeight/2+40).call(wrap,itemInfoWidth-30);
  var itemAttribute1 = svg3.append("text").attr('class','itemValue itemInfo')
                  .attr("x", plotWidth/10)
                  .attr("y", plotHeight/2+attributeHeight);
  var itemAttribute2 = svg3.append("text").attr('class','itemValue itemInfo')
                  .attr("x", plotWidth/10)
                  .attr("y", plotHeight/2+attributeHeight+attributeGap);
  var itemAttribute3 = svg3.append("text").attr('class','itemValueSub itemInfo')
                  .attr("x", plotWidth/10)
                  .attr("y", plotHeight/2+attributeHeight+attributeGap*2);
  var itemAttribute4 = svg3.append("text").attr('class','itemValueSub itemInfo')
                  .attr("x", plotWidth/10)
                  .attr("y", plotHeight/2+attributeHeight+attributeGap*3);
  var itemAttribute5 = svg3.append("text").attr('class','itemValueSub itemInfo')
                  .attr("x", plotWidth/10)
                  .attr("y", plotHeight/2+attributeHeight+attributeGap*4);

  //Add circles
  svg2.selectAll("circle").data(filteredData)
  .transition()  // Transition from old to new
  .duration(500)
  .attr("r", function(d){
    if(filteredData.indexOf(d)==defaultIndex){
      if(d.Restaurant=="McDonald's"){
        img = restaurant_img["McDonald's"];
      }else if(d.Restaurant=="Burger King"){
        img = restaurant_img["Burger King"];
      }else if(d.Restaurant=="Wendy's"){
        img = restaurant_img["Wendy's"];
      }else if(d.Restaurant=="White Castle "){
        img = restaurant_img["White Castle"];
      }
      itemImage.attr("xlink:href", img);
      itemName.text(d.ItemName);
      itemAttribute1.text("Calories: " + d.Calories);
      itemAttribute2.text("Total Fat: " + d.TotalFat + "g");
      itemAttribute3.text("Sodium: " + d.Sodium + "g");
      itemAttribute4.text("Cholesterol: " + d.Cholesterol + "g");
      itemAttribute5.text("Sugar: " + d.Sugar + "g");
      return radius*radiusFactor;
    }else{
      return radius;
    }
  })
  .attr("cx", function(d){
      return xScale(d.Calories)+xPadding*1.5;
  })
  .attr("cy", function(d){
      return yScale(d.TotalFat)+yPadding;
  })
  .attr("fill", function(d){
    if (d.Restaurant=="Burger King"){
        return color_list["Burger King"];
    } else if (d.Restaurant=="McDonald's"){
        return color_list["McDonald's"];
    } else if (d.Restaurant=="Wendy's"){
        return color_list["Wendy's"];
    } else if (d.Restaurant=="White Castle "){
        return color_list["White Castle"];
    } else{
        return 'white';
    }
  })
  .attr("opacity", function(d){
    if(filteredData.indexOf(d)==defaultIndex){
      return opacity+0.2;
    }else{
      return opacity;
    }
  });

  d3.selectAll("#itemName").call(wrap,itemInfoWidth-30);

  // Create mouseover and mouseout for the circle
  svg2.selectAll("circle")
  .data(filteredData)
  .on("mouseover", function (d) {
    //Reset attributes of selected circle
    svg2.selectAll("circle").data(filteredData)
    .attr("r", radius)
    .attr("opacity", opacity);
    //Update values of selected circle
    d3.select(this)
      .attr("stroke", "")
      .attr("r", radius*radiusFactor)
      .attr("opacity", 1);

    //Update Restaurant Images
    if(d.Restaurant=="McDonald's"){
      img = restaurant_img["McDonald's"];
    }else if(d.Restaurant=="Burger King"){
      img = restaurant_img["Burger King"];
    }else if(d.Restaurant=="Wendy's"){
      img = restaurant_img["Wendy's"];
    }else if(d.Restaurant=="White Castle "){
      img = restaurant_img["White Castle"];
    }
    //Mouse hover point values
    itemImage.attr("xlink:href", img);
    itemName.text(d.ItemName);
    itemName.text(d.ItemName).call(wrap,itemInfoWidth-30);
    itemAttribute1.text("Calories: " + d.Calories);
    itemAttribute2.text("Total Fat: " + d.TotalFat + "g");
    itemAttribute3.text("Sodium: " + d.Sodium + "g");
    itemAttribute4.text("Cholesterol: " + d.Cholesterol + "g");
    itemAttribute5.text("Sugar: " + d.Sugar + "g");
  })
  .on("mouseout", function(d){
    d3.select(this)
    .attr("stroke", "")
    .attr("opacity", function(d){
      return opacity+0.2;
    });
  });
}

//Display category title
function displayCategory(selectedCategory, selectedRestaurant){
  var categoryImage = svg4.append("svg:image").attr('class','categoryInfo')
                  .attr("x", screenWidth/2 - imageWidth/2)
                  .attr("y", imageWidth/5 )
                  .attr('height', imageWidth)
                  .attr('width', imageWidth)
                  .attr("xlink:href", category_img[selectedCategory]);

  var categoryName = svg4.append("text").attr('id','categoryName').attr('class','categoryInfo')
                  .attr("x", screenWidth/2)
                  .attr("y", imageWidth + imageWidth*7/8)
                  .text(category_list[selectedCategory]);

  }

//Update scatterplot and category info based on selected Category
function updateCategory(selectedCategory, selectedRestaurant){
  displayScatterPlot(selectedCategory, selectedRestaurant, foodData, "Calories", "Total Fat");
  displayCategory(selectedCategory, selectedRestaurant);
  window.scrollTo(0,screenHeight);
}

//Filter restaurant buttons
svg4.append("rect")
  .attr("id","hover-burgerKing")
  .attr("class","hover-restaurants")
  .attr("x", 226)
  .attr("y", 217)
  .attr('width', 194)
  .attr('height', 124)
  .attr("fill", "gray")
  .attr("fill-opacity", 0)
  .style("stroke", "#343434")
  .style("stroke-width", 0)
  .style("stroke-dasharray", "10,10")
.on("mouseover", function() {
  d3.select("#hover-burgerKing").attr("fill-opacity", 0.3);
})
.on("mouseout",function(){
  d3.select("#hover-burgerKing").attr("fill-opacity", 0);
})
.on("click", function(){
  d3.selectAll(".hover-restaurants").style("stroke-width", 0);
  d3.select("#hover-burgerKing").style("stroke-width", 5);
  d3.select("#clearSelection").style("visibility", "visible");
  updateCategory(selectedCategory, "Burger King");
});

svg4.append("rect")
  .attr("id","hover-mcDonalds")
  .attr("class","hover-restaurants")
  .attr("x", 426)
  .attr("y", 217)
  .attr('width', 194)
  .attr('height', 124)
  .attr("fill", "gray")
  .attr("fill-opacity", 0)
  .style("stroke", "#343434")
  .style("stroke-width", 0)
  .style("stroke-dasharray", "10,10")
.on("mouseover",function(){
  console.log('HOVERING');
  d3.select("#hover-mcDonalds").attr("fill-opacity", 0.3);
})
.on("mouseout",function(){
  d3.select("#hover-mcDonalds").attr("fill-opacity", 0);
})
.on("click", function(){
  d3.selectAll(".hover-restaurants").style("stroke-width", 0);
  d3.select("#hover-mcDonalds").style("stroke-width", 5);
  d3.select("#clearSelection").style("visibility", "visible");
  updateCategory(selectedCategory, "McDonald's");
});

svg4.append("rect")
  .attr("id","hover-wendys")
  .attr("class","hover-restaurants")
  .attr("x", 626)
  .attr("y", 217)
  .attr('width', 194)
  .attr('height', 124)
  .attr("fill", "gray")
  .attr("fill-opacity", 0)
  .style("stroke", "#343434")
  .style("stroke-width", 0)
  .style("stroke-dasharray", "10,10")
.on("mouseover",function(){
  d3.select("#hover-wendys").attr("fill-opacity", 0.3);
})
.on("mouseout",function(){
  d3.select("#hover-wendys").attr("fill-opacity", 0);
})
.on("click", function(){
  d3.selectAll(".hover-restaurants").style("stroke-width", 0);
  d3.select("#hover-wendys").style("stroke-width", 5);
  d3.select("#clearSelection").style("visibility", "visible");
  updateCategory(selectedCategory, "Wendy's");
});

svg4.append("rect")
  .attr("id","hover-whiteCastle")
  .attr("class","hover-restaurants")
  .attr("x", 825)
  .attr("y", 217)
  .attr('width', 194)
  .attr('height', 124)
  .attr("fill", "gray")
  .attr("fill-opacity", 0)
  .style("stroke", "#343434")
  .style("stroke-width", 0)
  .style("stroke-dasharray", "10,10")
.on("mouseover",function(){
  d3.select("#hover-whiteCastle").attr("fill-opacity", 0.3);
})
.on("mouseout",function(){
  d3.select("#hover-whiteCastle").attr("fill-opacity", 0);
})
.on("click", function(){
  d3.selectAll(".hover-restaurants").style("stroke-width", 0);
  d3.select("#hover-whiteCastle").style("stroke-width", 5);
  d3.select("#clearSelection").style("visibility", "visible");
  updateCategory(selectedCategory, "White Castle ");
});

//Button to scroll to the top
var scrollTop = svg3.append("image")
    .attr("id","hover-top")
    .attr("alt","Scroll to Top")
    .attr("xlink:href", "./img/scrollButton.svg")
    .attr("x",  itemInfoWidth-140)
    .attr("y", 560)
    .attr('width', 60)
    .attr('height', 60)
    .attr("opacity", 0.7)
    .on("mouseover",function(){
      d3.select("#hover-top").attr("opacity", 1);
    })
    .on("mouseout",function(){
      d3.select("#hover-top").attr("opacity", 0.7);
    })
    .on("click", function(){
      window.scrollTo(0,0);
    });
//Button to clear selected content
var clearSelection = svg3.append("image")
    .attr("id","clearSelection")
    .attr("alt","Clear Selected Restaurant")
    .attr("xlink:href", "./img/clearButton.svg")
    .attr("x",  itemInfoWidth-210)
    .attr("y", 560)
    .attr('width', 60)
    .attr('height', 60)
    .attr("opacity", 0.7)
    .style("visibility", "hidden")
    .on("mouseover",function(){
      d3.select("#clearSelection").attr("opacity", 1);
    })
    .on("mouseout",function(){
      d3.select("#clearSelection").attr("opacity", 0.7);
    })
    .on("click", function(){
      updateCategory(selectedCategory, "none");
      d3.selectAll(".hover-restaurants").style("stroke-width", 0);
      d3.select("#clearSelection").style("visibility", "hidden");
    });

//Found on Stack Overflow https://stackoverflow.com/questions/24784302/wrapping-text-in-d3
function wrap(text, width) {
    text.each(function () {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            x = text.attr("x"),
            y = text.attr("y"),
            dy = 0, //parseFloat(text.attr("dy")),
            tspan = text.text(null)
                        .append("tspan")
                        .attr("x", x)
                        .attr("y", y)
                        .attr("dy", dy + "em");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan")
                            .attr("x", x)
                            .attr("y", y)
                            .attr("dy", ++lineNumber * lineHeight + dy + "em")
                            .text(word);
            }
        }
    });
}

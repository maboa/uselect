$(document).ready(function(){   

	function drawPieChart(data) {
		$('#pie-chart').empty();
		var w = 120, //width
			h = 120, //height
			r = 60, //radius
			color = d3.scale.category20c(); //builtin range of colors

		color = ["#3366cc","#dc3912"];

		var vis = d3.select("#pie-chart")
			.append("svg:svg") //create the SVG element inside the <body>
			.data([data]) //associate our data with the document
			.attr("width", w) //set the width and height of our visualization (these will be attributes of the <svg> tag
			.attr("height", h)
			.append("svg:g") //make a group to hold our pie chart
			.attr("transform", "translate(" + r + "," + r + ")") //move the center of the pie chart from 0, 0 to radius, radius

		var arc = d3.svg.arc() //this will create <path> elements for us using arc data
			.outerRadius(r);

		var pie = d3.layout.pie() //this will create arc data for us given a list of values
			.value(function(d) { return d.value; }); // we must tell it out to access the value of each element in our data array

		pie.sort(null);

		var arcs = vis.selectAll("g.slice") //this selects all <g> elements with class slice (there aren't any yet)
			.data(pie) //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties) 
			.enter() //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
			.append("svg:g") //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
			.attr("class", "slice"); //allow us to style things in the slices (like text)

		arcs.append("svg:path")
			.attr("fill", function(d, i) { return color[i]; } ) //set the color for each slice to be chosen from the color function defined above
			.attr('stroke', '#fff')
			.attr("d", arc); //this creates the actual SVG path using the associated data (pie) with the arc drawing function

		arcs.append("svg:text")  
			.attr("fill","#fff") //add a label to each slice
			.attr("transform", function(d) { //set the label's origin to the center of the arc
				//we have to make sure to set these before calling arc.centroid
				d.innerRadius = 0;
				d.outerRadius = r;
				return "translate(" + arc.centroid(d) + ")"; //this gives us a pair of coordinates like [50, 50]
			})
			.attr("text-anchor", "middle") //center the text on it's origin
			.text(function(d, i) { return data[i].label; }); //get the label from our original data array
	}

	function pieChart(repCount, demCount) {

		var totCount = repCount + demCount,
			rPc = Math.round((repCount/(totCount)*1000))/10,
			dPc = Math.round((demCount/(totCount)*1000))/10;

		if (repCount == 0) {
			dPc = "";
		} else {
			dPc = dPc + "%";
		}

		if (demCount == 0) {
			rPc = "";     	
		} else {
			rPc = rPc + "%";
		}

		var piedata = [{"label":dPc, "value":demCount},{"label":rPc, "value":repCount}];

		drawPieChart(piedata);
	}

	// pieChart(10, 20);

	$('#pie-a').click(function() {
		pieChart(5, 10);
		return false;
	}).click();
	$('#pie-b').click(function() {
		pieChart(25, 40);
		return false;
	});
	$('#pie-c').click(function() {
		pieChart(60, 50);
		return false;
	});
	$('#pie-d').click(function() {
		pieChart(90, 15);
		return false;
	});

});
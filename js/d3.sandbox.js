$(document).ready(function(){   

	var pie, arc, arcs, arcLabels, pie_dur, r;

	function initPieChart() {

		$('#pie-chart').empty();

		// var data = [{"label":"-", "value":1},{"label":"-", "value":1}];

		var data = [1,1]; // [dem, rep]
		var labels = ['Dem','Rep'];

		var w = 120, //width
			h = 120, //height
			// color = d3.scale.category20c(); // builtin range of colors
			color = ["#3366cc","#dc3912"]; // Changed to define an array. Usually this is a function!

		r = 60; //radius
		pie_dur = 2000; // 750; // ms
		pie = d3.layout.pie().sort(null);
		arc = d3.svg.arc().outerRadius(r); //this will create <path> elements for us using arc data

		var svg = d3.select("#pie-chart")
			.append("svg:svg") //create the SVG element inside the <body>
			// .data([data]) //associate our data with the document
			.attr("width", w) //set the width and height of our visualization (these will be attributes of the <svg> tag
			.attr("height", h);
			// .append("svg:g") //make a group to hold our pie chart
			// .attr("transform", "translate(" + r + "," + r + ")") //move the center of the pie chart from 0, 0 to radius, radius

		var arc_grp = svg.append("svg:g")
			.attr("class", "arcGrp")
			.attr("transform", "translate(" + r + "," + r + ")"); //move the center of the pie chart from 0, 0 to radius, radius

		var label_grp = svg.append("svg:g")
			.attr("class", "labelGrp")
			.attr("transform", "translate(" + r + "," + r + ")"); //move the center of the pie chart from 0, 0 to radius, radius

		
/*
		pie = d3.layout.pie() //this will create arc data for us given a list of values
			.value(function(d) { return d.value; }); // we must tell it out to access the value of each element in our data array

		pie.sort(null);

		arcs = svg.selectAll("g.slice") //this selects all <g> elements with class slice (there aren't any yet)
			.data(pie) //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties) 
			.enter() //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
			.append("svg:g") //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
			.attr("class", "slice"); //allow us to style things in the slices (like text)

		arcs.append("svg:path")
			.attr("fill", function(d, i) { return color[i]; } ) //set the color for each slice to be chosen from the color function defined above
			.attr('stroke', '#fff')
			.attr("d", arc) //this creates the actual SVG path using the associated data (pie) with the arc drawing function
			.each(function(d) {this._current = d});

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
*/

		// DRAW ARC PATHS
		arcs = arc_grp.selectAll("path")
			.data(pie(data));
		arcs.enter().append("svg:path")
			.attr("stroke", "white")
			// .attr("stroke-width", 0.5)
			.attr("fill", function(d, i) {return color[i];}) // Note using an array and not usual color(i) functions.
			.attr("d", arc)
			.each(function(d) {this._current = d});

		// DRAW SLICE LABELS
		arcLabels = label_grp.selectAll("text")
			.data(pie(data));
		arcLabels.enter().append("svg:text")
			.attr("class", "arcLabel")
			.attr("transform", function(d) {
				d.innerRadius = 0;
				d.outerRadius = r;
				return "translate(" + arc.centroid(d) + ")";
			})
			.attr("text-anchor", "middle")
			.text(function(d, i) {return labels[i]; });
	}

	initPieChart();

	// Store the currently-displayed angles in this._current.
	// Then, interpolate from this._current to the new angles.
	function arcTween(a) {
		var i = d3.interpolate(this._current, a);
		this._current = i(0);
		return function(t) {
			return arc(i(t));
		};
	}

	function updatePieChart(repCount, demCount) {

		var totCount = repCount + demCount,
			rPc = Math.round(repCount/totCount*1000)/10,
			dPc = Math.round(demCount/totCount*1000)/10;

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
		var data = [demCount,repCount];
		var labels = [dPc,rPc];

		arcs.data(pie(data)); // recompute angles, rebind data
		arcs.transition().ease("elastic").duration(pie_dur).attrTween("d", arcTween);

		arcLabels.data(pie(data));
		arcLabels.text(function(d, i) {return labels[i]; });
		arcLabels.transition().ease("elastic").duration(pie_dur)
			.attr("transform", function(d) {
				d.innerRadius = 0;
				d.outerRadius = r;
				return "translate(" + arc.centroid(d) + ")";
			})
			.style("fill-opacity", function(d) {return d.value==0 ? 1e-6 : 1;});
	}

	// pieChart(10, 20);

	$('#pie-a').click(function() {
		updatePieChart(5, 10);
		return false;
	}); // .click();
	$('#pie-b').click(function() {
		updatePieChart(25, 40);
		return false;
	});
	$('#pie-c').click(function() {
		updatePieChart(60, 50);
		return false;
	});
	$('#pie-d').click(function() {
		updatePieChart(90, 15);
		return false;
	});

});
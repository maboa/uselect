$(document).ready(function(){   

	// Expose these functions to main scope.
	var initPieChart = function() {},
		updatePieChart = function() {};

	// Closure to keep local vars away from main scope.
	(function() {
		// var pie, arc, arcs, arcLabels, pie_dur, r;

		var w = 120, //width
			h = 120, //height
			r = 60, //radius
			pie_dur = 2000, // 750; // ms
			// color = d3.scale.category20c(), // builtin range of colors
			color = ["#3366cc","#dc3912"], // Changed to define an array. Usually this is a function!
			pie = d3.layout.pie().sort(null),
			arc = d3.svg.arc().outerRadius(r), //this will create <path> elements for us using arc data
			arcs, arcLabels;


		initPieChart = function() {

			$('#pie-chart').empty();

			// var data = [{"label":"-", "value":1},{"label":"-", "value":1}];

			var data = [1,1]; // [dem, rep]
			var labels = ['Dem','Rep'];

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
				.attr("fill","#fff")
				.attr("transform", function(d) {
					d.innerRadius = 0;
					d.outerRadius = r;
					return "translate(" + arc.centroid(d) + ")";
				})
				.attr("text-anchor", "middle")
				.text(function(d, i) {return labels[i]; });
		};

		// initPieChart();

		// Store the currently-displayed angles in this._current.
		// Then, interpolate from this._current to the new angles.
		function arcTween(a) {
			var i = d3.interpolate(this._current, a);
			this._current = i(0);
			return function(t) {
				return arc(i(t));
			};
		}

		updatePieChart = function(demCount, repCount) {

			var totCount = demCount + repCount,
				dPc = Math.round(demCount/totCount*1000)/10,
				rPc = Math.round(repCount/totCount*1000)/10;

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

			// Avoid zero data
			if(!demCount && !repCount) {
				demCount = 1;
				repCount = 1;
			}

			// var piedata = [{"label":dPc, "value":demCount},{"label":rPc, "value":repCount}];
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
		};

	})();

	initPieChart();

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
	$('#pie-e').click(function() {
		updatePieChart(0, 1);
		return false;
	});
	$('#pie-f').click(function() {
		updatePieChart(1, 0);
		return false;
	});
	$('#pie-g').click(function() {
		updatePieChart(0, 0);
		return false;
	});

});
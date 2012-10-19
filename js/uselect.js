/*
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * Authors: Mark Boas, Mark J Panaghiston
 *
 * For: Al-Jazeera and OpenNews
 *
 * Date: 4th October 2012
 */

$(document).ready(function(){   

	// The prefix variables should always be populated

	var demCandPrefix = "BARACK OBAMA:";
	var repCandPrefix = "MITT ROMNEY:";
	var moderatorPrefix = "CANDY CROWLEY:";
	var audiencePrefix = "AUDIENCE:";



	var fbTitle = "Obama vs Romney : Interactive video transcript";

	var locationUrl = (window.location != window.parent.location) ? document.referrer: document.location;

	var hashTag = "#debates #election2012";

	var operaBarChartFix = true;

	var searchDefault = "search transcript";

	$('#searchStr').focus();
	$('#searchStr').attr('value',searchDefault);
	




	$('#main-loader').append('.');
	var bars = 40;
	var data = new Array(bars);

	var maxData = 0;
	var tPause = 0;


	// NB: IE8 D3 support https://github.com/mbostock/d3/issues/619
	// Added Sizzle and es5-shim, but fails silently in IE8.

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

	function drawBarChart(data) {
		$('#chart').empty();
		var barWidth = 14;
		var width = (barWidth + 4) * data.length;
		var height = 70;

		var colorlist = ["#ffcccc", "#ccccff"];

		//if ($('#repCb:checked').val()) {
			colorlist[0]="#dc3912";
		//}

		//if($('#demCb:checked').val()) {
			colorlist[1]="#3366cc";	
		//}

		var paddingList = [1,-1];

		var x = d3.scale.linear().domain([0, data.length]).range([0, width]);
		var y = d3.scale.linear().domain([0, d3.max(data, function(datum) { return datum.s; })]).
		  rangeRound([0, height]);

		// add the canvas to the DOM


		var barDemo = d3.select("#chart").
		  append("svg:svg").
		  attr("width", width).
		  attr("height", height);


		barDemo.selectAll("rect").
		  data(data).
		  enter().
		  append("svg:rect").
		  attr("x", function(datum, index) { return x(index) + paddingList[index % 2]; }).
		  attr("y", function(datum) { return height - y(datum.s); }).
		  attr("height", function(datum) { return y(datum.s); }).
		  attr("width", barWidth).
		  attr("fill", function(d, i) { return colorlist[i % 2]; });

		// text on bars

		barDemo.selectAll("text").
		  data(data).
		  enter().
		  append("svg:text").
		  attr("x", function(datum, index) { return x(index) + barWidth + paddingList[index % 2]; }).
		  attr("y", function(datum) { return height - y(datum.s); }).
		  attr("dx", -barWidth/2 ).
		  attr("dy", "1em").
		  attr("text-anchor", "middle").
		  text(function(datum) { return datum.s;}).
		  attr("fill", "white");

		var rules = barDemo.append("g");

    // Add rules

  	rules = rules.selectAll(".rule")
   		.data(y.ticks(d3.max(data, function(datum) { return datum.s; })))
    	.enter().append("g")
    	.attr("class", "rule")
    	.attr("transform", function(d) { return "translate(0," + y(d) + ")"; });
  
  	rules.append("line")
      .attr("x2", width);

    barDemo.selectAll("rect").on("click", function(d,i) {

  	});

		maxData = d3.max(data, function(datum) { return datum.s; });

	}


		
	var theScript = [];  
	var mediaDirM = "http://bc05.ajnm.me/665003303001";
	var mediaDirW = "http://webapps.aljazeera.net/aje/custom/debate/d3";
	var transcriptDir = "transcripts";  

	var videoM = new Array();
	var videoW = new Array();
	
	// mp4

	videoM['lo'] = "665003303001_1905567366001_DEBATE3-SOT-03D-17.mp4";
	videoM['me'] = "665003303001_1905579071001_DEBATE3-SOT-03D-17.mp4";
	videoM['hi'] = "665003303001_1905661386001_DEBATE3-SOT-03D-17.mp4";
	videoM['hd'] = "665003303001_1905581731001_DEBATE3-SOT-03D-17.mp4";

	// webm

	videoW['lo'] = "debate3.webm";
	videoW['me'] = "debate3.webm";
	videoW['hi'] = "debate3.webm";
	videoW['hd'] = "debate3.webm";

	var latency = 1000;

	var theScriptState = [];

	var theScriptLength = theScript.length; 
		
		
	var currentyLoaded = "";
	var currentTime = 0;
	var hints = true;
	var playSource = true;
		

		
	var myPlayer = $("#jquery_jplayer_1");
	
	// moved jPlayer instancing to loadFile()

	$.jPlayer.timeFormat.showHour = true;

	var i = 0;
   

		// These events are fired as play time increments  

		var playingWord = 1;    
		
		
		// transcript links to audio

		$('#transcript').delegate('span','click',function(e){ 
			playSource = true;
			tPause = 0; 
			endTime = null;
			var jumpTo = $(this).attr('m')/1000; 
			myPlayer.jPlayer("play",jumpTo);  
			$('#play-btn-source').hide();
			$('#pause-btn-source').show();  

			/*e.stopPropagation();
			e.preventDefault(); 
    	e.stopImmediatePropagation();*/

    	_gaq.push(['_trackEvent', 'USElect', 'Word clicked', 'word '+$(this).text()]);
		   
			return false;
		});     
		
		var index = "";
		var filename = "";
		var end = "";
		var start = ""; 
		var mediaId = "";
		
		myPlayer.bind($.jPlayer.event.ended, function() {  
			// 
		}); 

		myPlayer.bind($.jPlayer.event.timeupdate, function(event) {       
			currentTime = event.jPlayer.status.currentTime; 
    });

		/* load in the file */  

		loadFile('debate08');

		function initPopcorn(id) {   
			var p = Popcorn(id)
			.code({
			  start: 0,
		    onStart: function (options) {
		         //console.log('start')
		     },
		     onFrame: (function () {



				// Warning: This might start polling before the transcript is loaded and ready.

		        var count = 0;
		        var endedLoop = false;
		        
		        return function (options) {

		       	//console.log('here');
					
            var now = this.Popcorn.instances[0].media.currentTime*1000;  

            //console.log("now="+now/100);
            //console.log("end="+endTime); 

            if (endTime && endTime < (now / 100) ) {
            	myPlayer.jPlayer("pause");
            	endTime = null;
            }
					
						var src = "";

						if (endedLoop == true) {
							index = 0;
							endedLoop = false;
							end = -1;
							//console.log("e now="+now);
							//console.log("e end="+end);
							myPlayer.jPlayer("pause");
							//console.log('ended loop');
						}

						if (now > end && playSource == false) {   

							//console.log('in');

          		//myPlayer.jPlayer("pause"); // MJP: Looks like old code. Commented out.
							index = parseInt(index);

							// check for the end

							

							if (theScript.length < (index+1) && now > end) {
								myPlayer.jPlayer("pause");

								//console.log("paused");

								// check for loop

								

								if (getUrlVars()["l"] != null) {
									endedLoop = true;
								} else {
									tPause = 0;
									playSource = true;
								}
							} 
							
							if (theScript.length > index) {  

								// moving to the next block in the target

								      

								start = theScript[index].s;   
								end = theScript[index].e;

								//console.log(start);
								//console.log(end);
								//console.log(now);

							
								//myPlayer.bind($.jPlayer.event.progress + ".fixStart", function(event) {
									//console.log("p now="+now);
									//console.log("p end="+end);
									// Warning: The variable 'start' must not be changed before this handler is called.
							   // $(this).unbind(".fixStart"); 
							    //console.log('log about to play from '+start);
									myPlayer.jPlayer("play",start/1000);
									index = index + 1; 
									//end = theScript[index].e;
								//});     

				
								//myPlayer.jPlayer("pause",start);   
							}  



						}   
		      }
		    })(),
		    onEnd: function (options) {
		         //console.log('end');
		    }
			}); 
			return p; 
		};

		$('.quality-switch').click(function(){
			var timeOnClick = currentTime;
			var quality = $(this).attr('q');
			var mediaMp4 = mediaDirM+'/'+videoM[quality];
			var mediaWebM = mediaDirW+'/'+videoW[quality];
			// IE9 needs a fix to support SetMedia followed by play(time). It works for all browsers.
			myPlayer.bind($.jPlayer.event.progress + ".ie9fix", (function(time) {
				return function() {
					$(this).unbind(".ie9fix");
					$(this).jPlayer("play",time);
				};
			})(timeOnClick));
			myPlayer.jPlayer('setMedia', {m4v: mediaMp4, webmv: mediaWebM});
			// myPlayer.jPlayer('play',timeOnClick);
			$('.jp-quality-ctrl').fadeOut();
			$('.quality-btn').hide();
			$('.quality-btn[q="'+quality+'"]').show();
			//$('.jp-video-busy').show();

			_gaq.push(['_trackEvent', 'USElect', 'Quality button', 'switched to '+$(this).attr('q')]);

			return false;
		})	

		$('.quality-btn').click(function(){

			if ($('.jp-quality-ctrl').is(':visible')) { 

				$('.jp-quality-ctrl').fadeOut();
				$('.fs-quality-ctrl').fadeOut();
					
			} else {
				$('.jp-quality-ctrl').fadeIn();
			}

			_gaq.push(['_trackEvent', 'USElect', 'Quality button', 'clicked']);

			return false;
		});		

		function initTranscript(p) {
			//console.log("initTranscript in "+(new Date()-startTimer));
			$("#transcript-content span").each(function(i) {  
				// doing p.transcript on every word is a bit inefficient - wondering if there is a better way
				p.transcript({
					time: $(this).attr("m") / 1000, // seconds
					futureClass: "transcript-grey",
					target: this,
					onNewPara: function(parent) {
						$("#transcript-content").stop().scrollTo($(parent), 800, {axis:'y',margin:true,offset:{top:0}});
					}
				});  
			});
			//console.log("initTranscript out "+(new Date()-startTimer));
		}

		// Reviewed recursively async adding the plugins to avoid lock up at start.
		// It worked, but took a long time to complete.
		// Plus, you could scroll down in text way ahead of this function loop and click on word, which kinda broke it...
		// As it was not setup for that word yet.
		function initTranscriptAsync(p) {
			var $trans = $("#transcript-content span");
			var asyncTrans = function(i) {
				if(i < $trans.length) {
					p.transcript({
						time: $($trans[i]).attr("m") / 1000, // seconds
						futureClass: "transcript-grey",
						target: $trans[i],
						onNewPara: function(parent) {
							$("#transcript-content").stop().scrollTo($(parent), 800, {axis:'y',margin:true,offset:{top:0}});
						}
					});
					setTimeout(function() {
						asyncTrans(i+1);
					},0);
				}
			};
			asyncTrans(0);
		}

		$('rect,text').live('click',function(e){
			playSource = true;
			tPause = 0;
			var top = $('#chart').offset().top;
			var height = $('#chart').height();
			var piece = (maxData-1) - (Math.floor((e.clientY-top) / (height/maxData)));

			// text items are placed next to rects affecting their indexes so we need to mod

			var gIndex = $(this).index() % bars;
			var m = hitsDetails[gIndex][piece];
			jumpTo = m/1000;
			myPlayer.jPlayer("play",jumpTo);  

			var $target = $('#transcript-content span[m="'+m+'"]').parent(); // The paragraph of the word.

			$target = $target.prev().length ? $target.prev() : $target; // Select the previous paragraph if there is one.
			// Transcript has progressed beyond last paragraph, select last. Prevents crash in jquery
    	$target = $target.length ? $target : $("#transcript-content span").last().parent();
    
    	$("#transcript-content").stop().scrollTo($target, 1000, {axis:'y',margin:true});

    	_gaq.push(['_trackEvent', 'USElect', 'Bar chart clicked', 'Bar '+gIndex]);

			return false;
		});
		
		var startTimer = new Date();

		function loadFile(id) { 

			checkEasterParam();

			$('#main-loader').append('.');
			var file = transcriptDir+'/'+id+'.htm'; 

			var mediaMp4 = mediaDirM+'/'+videoM['me'];
			var mediaWebM = mediaDirW+'/'+videoW['me'];
			 
			currentlyPlaying = id;

			var p, busySeekId, busyWaitId, delayBusy = 250, loadTrans = function() {
				//console.log("loadTrans in "+(new Date()-startTimer));
				$('#load-status').html('loading ...');

				$('#transcript-content').load(file, function() {
					//console.log("loaded Transcript "+(new Date()-startTimer));
				  	//load success!!!     
					initTranscript(p);

					$('#main-loader').append('.');

					$.data(myPlayer,'mediaId',id);
					
					countWords();

					checkStartParam();
					checkKeywordParam();

					myPlayer.jPlayer("volume", 1); // max volume

					//$('.jp-video-busy').show();
					//$('#transcript').animate({scrollTop: $("#page").offset().top}, 2000);
			
				});
				//console.log("loadTrans out "+(new Date()-startTimer));

				// ugly chrome fix to stop scroll-bar disappearing

				/*var bodyRow = $('.body.row');
				var bottom = parseInt(bodyRow.css('bottom').replace('px',''));
				bodyRow.animate({bottom: bottom+1+'px'}, 500);
				bodyRow.animate({bottom: bottom+'px'}, 500);*/

				// end ugly chrome fix
			};

			myPlayer.jPlayer({
				ready: function (event) {
					if(event.jPlayer.html.used && event.jPlayer.html.video.available) {
						p = initPopcorn('#' + myPlayer.data("jPlayer").internal.video.id);
					} else {
						$(this).jPlayer('option', 'emulateHtml', true);
						p = initPopcorn('#' + myPlayer.attr('id'));
						$(this).trigger($.jPlayer.event.loadeddata);
					}
					$(this).jPlayer("setMedia", {
						m4v: mediaMp4,
						webmv: mediaWebM,
						poster: "poster.jpg"
					});
					setTimeout(function() {
						loadTrans();
					}, 1000);
				},
				seeking: function() {
					clearTimeout(busySeekId);
					busySeekId = setTimeout(function() {
						$('.jp-video-busy').show();
					},delayBusy);
				},
				seeked: function() {
					clearTimeout(busySeekId);
					$('.jp-video-busy').hide();
				},
				waiting: function() {
					clearTimeout(busyWaitId);
					busyWaitId = setTimeout(function() {
						$('.jp-video-busy').show();
					},delayBusy);
				},
				playing: function() {
					clearTimeout(busyWaitId);
					$('.jp-video-busy').hide();
				},
				solution: "html, flash",
				swfPath: "js",
				supplied: "m4v,webmv",
				preload: "auto",
				size: {
					width: "720px",
					height:"405px",
					cssClass: "jp-video-360p"
				}
			});
		} 
		

		

		// select text function

		function getSelText()
		{
			var txt = '';
			if (window.getSelection){
				txt = window.getSelection();
			}
			else if (document.getSelection){
				txt = document.getSelection();
			}
			else if (document.selection){
				txt = document.selection.createRange().text;
			}          

			return txt;
		}


		$('#transcript-content').mouseup(function(e){     

			playSource = true;
			tPause = 0;
			
			var s = 0, e = 0;
	 		var select = getSelText(); 
	  		var tweetable = select+"";  

			var startSpan = select.anchorNode.nextSibling; 
			if (startSpan == null) {
				startSpan = select.anchorNode.parentNode;
			}
			
			var endSpan = select.focusNode.nextSibling;    
			if (endSpan == null) {  
				endSpan = select.focusNode.parentNode.nextElementSibling; 
				if (endSpan == null) {
					endSpan = select.focusNode.parentNode;
				}
			}     
			
			// We can do this better by looking at the complete tweet once generated and then removing from inside the quote until it fits 140 chars 
			
			if (tweetable.length > 78) {
				tweetable = tweetable.substr(0,75)+'...';
			}
						      
			
			// Short and sweet      
			
			var s = Math.floor(parseInt(startSpan.getAttribute('m'))/100); 
			var e = Math.floor(parseInt(endSpan.getAttribute('m'))/100);   
			
			// Make sure s < e
			
			if (s > e) {
				var temp = e;
				e = s;
				s = temp;
			}
			  
			// Check that it isn't a single click ie endtime is not starttime   
			// Also that tweetable is > 0 in length
			
			if (tweetable.length > 0) {    
			
				// Clean up window.location in case it already has params on the url    
			
				var winLoc = locationUrl;      
				var url = winLoc;
				var paramStart = winLoc.indexOf('?');   
			
				if (paramStart > 0) {
					url = winLoc.substr(0,paramStart);
				}
			 
				var theTweet = "'"+tweetable+"' "+url+"?s="+s+"-"+e+" "+hashTag;//+"&e="+e;  
				 
				$('.share-snippet').empty();
				$('.share-snippet').append(theTweet);  
				$('#tweet-like').empty();
				$('#tweet-like').append('<script type="text/javascript" src="http://platform.twitter.com/widgets.js"></script><a data-url="" data-text="'+theTweet+'" href="http://twitter.com/share?url=none&count=none" class="twitter-share-button">Tweet</a>');  
				
				// uncomment this line when we go live!
				//url = "http://www.aljazeera.com/indepth/interactive/2012/10/20121049528478583.html";
				var fbLink = "http://www.facebook.com/sharer.php?s=100&p[title]="+fbTitle+"&p[url]="+url+"&p[summary]="+encodeURIComponent(tweetable);
				//var fbLink = "http://www.facebook.com/sharer.php?u="+url+"?s="+s+"-"+e;
				$('#fb-link').attr('href',fbLink);
				$('#fb-link').show();
				

				//http://www.facebook.com/sharer.php?s=100&p[title]=titlehere&p[url]=http://www.yoururlhere.com&p[summary]=yoursummaryhere&p[images][0]=http://www.urltoyourimage.com

				_gaq.push(['_trackEvent', 'USElect', 'Tweet generated', 'Tweet content '+theTweet]);
			} 
		}); 

		$('#transcript-content-hint').click(function() {
			$(this).fadeOut('slow');
			hints = false;
		});


		$('#play-btn-source').click(function(){
			myPlayer.jPlayer("play");
			$(this).hide();
			$('#pause-btn-source').show();
			return false;
		});

		$('#pause-btn-source').click(function(){
			myPlayer.jPlayer("pause");
			$(this).hide();
			$('#play-btn-source').show();
			return false;
		});

		$('#clear-btn').click(function(){   
			
			//$.bbq.removeState();
			theScript = [];
			$('#transcript-content').html('');
			$('#target-content').html('');

			return false;
		});

		
		$('#instructions-btn').click(function(){   
			
			if($('#instructions').is(':visible')){
				$('#instructions').fadeOut();
			} else {
				$('#instructions').fadeIn();
			}
			 
			return false;
		});

		$("#searchStr").click(function(e) {
			if ($("#searchStr").val() == searchDefault) {
				$("#searchStr").val('');
				$('#searchStr').css('color','#000');
			}
		});

		$("#searchStr").keydown(function(e) {
			if ($("#searchStr").val() == searchDefault) {
				$("#searchStr").val('');
				$('#searchStr').css('color','#000');
			}

    	if(e.which == 13) {
    		playSource = true;
    		tPause = 0;
    		$('#search-btn').trigger('click');
        return false;
    	}
		});

		var speakerWords = [];

		function countWords() {
			//console.log("countWords in "+(new Date()-startTimer));
			var wordData = [];
			var speaker = "";
			var numWords = 0;
			speakerWords['d'] = 0;
			speakerWords['r'] = 0;
			speakerWords['m'] = 0;

			//var total = 0;

			var speaking = null;

			$('#transcript-content p').each(function(i) {


					if ($(this).children(':first').text().indexOf(demCandPrefix) >= 0) {
						speaking = 'd';
					} 

					if ($(this).children(':first').text().indexOf(repCandPrefix) >= 0) {
						speaking = 'r';
					}

					if ($(this).children(':first').text().indexOf(moderatorPrefix) >= 0) {
						speaking = 'm';
					}		

					if ($(this).children(':first').text().indexOf(audiencePrefix) >= 0) {
						speaking = 'a';
					}		

					speakerWords[speaking] = speakerWords[speaking] + $(this).children().length;



				//console.log('length='+$(this).children().length);

			 	//total = total + $(this).children().length;
			});

			/*console.log(total);
			console.log(speakerWords['d']);
			console.log(speakerWords['r']);
			console.log(speakerWords['m']);
			console.dir(speakerWords);*/

			//console.dir(speakerWords);

			updatePieChart(speakerWords['d'],speakerWords['r']);

			$('#repWords').text(" - "+speakerWords['r']);
			$('#demWords').text(" - "+speakerWords['d']);
			//console.log("countWords out "+(new Date()-startTimer));
		}

    function cleanWord(w) {
    	return w.replace(demCandPrefix+" ","").replace(repCandPrefix+" ","").replace(".","").replace(",","").replace("!","").replace("?","").replace("-","").replace("-","").toLowerCase();
    }

    var hitsDetails;

		$('#search-btn').click(function(e){   

			if (e.originalEvent instanceof MouseEvent) {
				//console.log('cleared');
				playSource = true;
				tPause = 0;
			}

			hitsDetails = [];

			var searchStr = $('#searchStr').val().toLowerCase();

			var matches = [];
			var speakers = [];
			var demCount = 0;
			var repCount = 0;

			$('#transcript-content span').css('background-color','white');

			$('#transcript-content span').each(function(i) {
				//console.log($(this).text());
				var searchWords = searchStr.split(" ");
				//if (cleanWord($(this).text()).indexOf('jack') >=0 ) console.log(cleanWord($(this).text()));
				if (searchWords[0] == cleanWord($(this).text())) {
					
					var matching = true;
					if (searchWords.length == 1) {
						//$(this).css('background-color','yellow');
					} else {
						var nextWord = $(this).next();

						for (var w=1; w < searchWords.length; w++) {

							if (searchWords[w] != cleanWord(nextWord.text())) {
								matching = false;
							}
							nextWord = nextWord.next();
						}
					}
					
					if (matching == true) {

						var thisWord = $(this);
						var timeSpan = {};
						timeSpan.s = parseInt($(this).attr('m'));
						timeSpan.e = parseInt($(this).attr('m'))+parseInt(tPause);
						//console.log('tp='+tPause);
						

						/*establish the speaker*/

						var wordElement = $(this).parent().children(':first');
						var word = wordElement.text();

						while (word.indexOf(demCandPrefix) < 0 && word.indexOf(repCandPrefix) < 0 && word.indexOf(moderatorPrefix) < 0) {
							wordElement = wordElement.parent().prev().children(':first');
							word = wordElement.text();
						}
						
						if (word.indexOf(demCandPrefix) >= 0) {
							speakers.push('d');
							matches.push($(this).attr('m'));
							demCount++;
							for (var w=0; w < searchWords.length; w++) {
								thisWord.css('background-color','yellow');
								thisWord = thisWord.next();
							}	
							theScript.push(timeSpan); 
						}

						if (word.indexOf(repCandPrefix) >= 0) {
							speakers.push('r');
							matches.push($(this).attr('m'));
							repCount++;
							for (var w=0; w < searchWords.length; w++) {
								thisWord.css('background-color','yellow');
								thisWord = thisWord.next();
							}	
							theScript.push(timeSpan); 
						}

						/*if (word.indexOf('JIM LEHRER:') >= 0) {
							speakers.push('s');
						}*/
					}
				}


			});

			var hits = new Array(bars);
			for (var h=0; h < hits.length; h++) {
				hits[h] = 0;
			}

			for (var n=0; n < matches.length; n++) {	
				if (speakers[n] == 'r') {
					var barI = 2*(Math.floor(matches[n]/300000));
					hits[barI]++;	
					if (!hitsDetails[barI]) {
						hitsDetails[barI] = new Array();
					}
					hitsDetails[barI].push(matches[n]);
				}

				if (speakers[n] == 'd') {
					var barJ = 2*(Math.floor(matches[n]/300000))+1;
					hits[barJ]++;	
					if (!hitsDetails[barJ]) {
						hitsDetails[barJ] = new Array();
					}
					hitsDetails[barJ].push(matches[n]);
				}
				
			}

			for (var h=0; h < hits.length; h++) {
				data[h] = {};
				data[h].s = hits[h];
				//data[h].m = hitsDetails[h];
			}

			// The chart gets drawn twice now to fix Opera bug and to make it slide in nicely for other browsers.
			drawBarChart(data); // Moved down to animated callback. Opera bug on 1st chart.

      updatePieChart(demCount,repCount);

      $('#repWords').text(" - "+repCount);
			$('#demWords').text(" - "+demCount);

			$('#pieTitle').text($('#searchStr').val());

			// set up tweet

			var winLoc = locationUrl;      
			var url = winLoc;
			var paramStart = winLoc.indexOf('?');   
			
			if (paramStart > 0) {
				url = winLoc.substr(0,paramStart);
			}
			 
			var keyword = searchStr.split(' ').join('%20');
			var theTweet = "How often was '"+searchStr+"' mentioned? "+url+"?k="+keyword+" "+hashTag;//+"&e="+e;  
				 
			$('.share-snippet').empty();
			$('.share-snippet').append(theTweet);  
			$('#tweet-like').empty();
			$('#tweet-like').append('<script type="text/javascript" src="http://platform.twitter.com/widgets.js"></script><a data-url="" data-text="'+theTweet+'" href="http://twitter.com/share?url=none&count=none" class="twitter-share-button">Tweet</a>');  

			//var fbLink = "http://www.facebook.com/sharer.php?u="+url+"?k="+keyword;

			var fbLink = "http://www.facebook.com/sharer.php?s=100&p[title]="+fbTitle+"&p[url]="+url+"&p[summary]="+encodeURIComponent(theTweet);

			$('#fb-link').attr('href',fbLink);
			$('#fb-link').show();

			$('.mini-footer').slideUp(function() {
				$('.footer').slideDown(function() {
					if(operaBarChartFix) {
						operaBarChartFix = false;
						drawBarChart(data); // Draw the graph again to keep Opera happy that 1st time.
					}
				});
				$('.body.row').animate({bottom: '164px'}, 500);
				$('#fade-bot').animate({top: '544px'}, 500);
				$('#transcript-inst-panel').fadeOut();
			});

			// uncomment below to activate search term playback
				
			if (tPause > 0) {	
				//console.log('tPause='+tPause);
				playSource = false;
				end = -1;
				index = 0;
			}
			//console.dir(theScript);
			
			_gaq.push(['_trackEvent', 'USElect', 'Search ', 'Keyword(s) ='+searchStr]);

			return false;
		});

	  var endTime =  null;

		function checkStartParam() {
			var param = getUrlVars()["s"];
			if ( param != null) {  
				var sParam = null;
				if ( param.indexOf('-') >= 0 ) {
					sParam = param.substr(0, param.indexOf('-'));
					var eParam = param.substr(param.indexOf('-')+1,param.length);
					endTime = parseInt(eParam);
					//console.log("endTime = "+endTime);
				} else {
					sParam = param;
					endTime = null;
				}

				var s = parseInt(sParam);

				//console.log("s = "+sParam);

				myPlayer.jPlayer("play",s/10);    
				_gaq.push(['_trackEvent', 'USElect', 'Start/End parameter', 'Triggered at '+s]);
			}
		}

		function checkKeywordParam() {
			if (getUrlVars()["k"] != null) {    
				var s = getUrlVars()["k"];
				s = s.split('%20').join(' ');
    		$('#searchStr').val(s);
    		$('#search-btn').trigger('click');
				_gaq.push(['_trackEvent', 'USElect', 'Keyword parameter', 'Triggered at '+s]);
			}
		}



		function checkEasterParam() {
			if (getUrlVars()["t"] != null) {    
				var t = getUrlVars()["t"];
				if (t != null) {
					tPause = t;
				}
				_gaq.push(['_trackEvent', 'USElect', 'Easter parameter', 'Triggered with '+t]);
			}
		}


		function getUrlVars() {
			var vars = [], hash;
			var myWindow = window;

			if (parent) {
				myWindow = parent.window;
			}


			//if (isAString(locationUrl) == false) {
			if (typeof locationUrl != "string") {
				locationUrl = locationUrl.href;
			}


			var hashes = locationUrl.slice(locationUrl.indexOf('?') + 1).split('&');
			for(var i = 0; i < hashes.length; i++)
			{
				hash = hashes[i].split('=');
				vars.push(hash[0]);
				vars[hash[0]] = hash[1];
			}

	    return vars;
	  }  

	  $('.thumb-link').click(function(){
	  	myPlayer.jPlayer('play',$(this).attr('data-start')/10);
	  	endTime = $(this).attr('data-end');
	  	playSource = true;
			tPause = 0;
			_gaq.push(['_trackEvent', 'USElect', 'Dont Miss', 'Triggered with '+$(this).attr('data-start')]);
	  	return false;
	  });

		$('#main-loader').append('.');

		
});    
$(document).ready(function(){   

	var locationUrl = (window.location != window.parent.location) ? document.referrer: document.location;
	var hashTag = "#USElect12";
	//getUrlVars();
	//console.log(getUrlVars()["s"]);

	$('#main-loader').append('.');
	var bars = 40;
	var data = new Array(bars);

	var maxData = 0;

	function drawPieChart(data) {
		$('#pie-chart').empty();
		var w = 120,                        //width
    h = 120,                            //height
    r = 60,                            //radius
    color = d3.scale.category20c();     //builtin range of colors

    color = ["#3366cc","#dc3912"];

    
    var vis = d3.select("#pie-chart")
        .append("svg:svg")              //create the SVG element inside the <body>
        .data([data])                   //associate our data with the document
            .attr("width", w)           //set the width and height of our visualization (these will be attributes of the <svg> tag
            .attr("height", h)
        .append("svg:g")                //make a group to hold our pie chart
            .attr("transform", "translate(" + r + "," + r + ")")    //move the center of the pie chart from 0, 0 to radius, radius

    var arc = d3.svg.arc()              //this will create <path> elements for us using arc data
        .outerRadius(r);

    var pie = d3.layout.pie()           //this will create arc data for us given a list of values
        .value(function(d) { return d.value; });    //we must tell it out to access the value of each element in our data array

    pie.sort(null);

    var arcs = vis.selectAll("g.slice")     //this selects all <g> elements with class slice (there aren't any yet)
        .data(pie)                          //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties) 
        .enter()                            //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
            .append("svg:g")                //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
                .attr("class", "slice");    //allow us to style things in the slices (like text)

        arcs.append("svg:path")
                .attr("fill", function(d, i) { return color[i]; } ) //set the color for each slice to be chosen from the color function defined above
                .attr('stroke', '#fff')
                .attr("d", arc);                                    //this creates the actual SVG path using the associated data (pie) with the arc drawing function

        arcs.append("svg:text")  
        				.attr("fill","#fff")                                   //add a label to each slice
                .attr("transform", function(d) {                    //set the label's origin to the center of the arc
                //we have to make sure to set these before calling arc.centroid
                d.innerRadius = 0;
                d.outerRadius = r;
                return "translate(" + arc.centroid(d) + ")";        //this gives us a pair of coordinates like [50, 50]
            })
            .attr("text-anchor", "middle")                          //center the text on it's origin
            .text(function(d, i) { return data[i].label; });        //get the label from our original data array
	}



	function drawBarChart(data) {
		$('#chart').empty();
		var barWidth = 14;
		var width = (barWidth + 4) * data.length;
		var height = 70;

		var colorlist = ["#ffcccc", "#ccccff"];

		if ($('#repCb:checked').val()) {
			colorlist[0]="#dc3912";
		}

		if($('#demCb:checked').val()) {
			colorlist[1]="#3366cc";	
		}

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

  		console.dir(d);
  		console.dir(i);
  	});

		maxData = d3.max(data, function(datum) { return datum.s; });

	}


		
	var theScript = [];  
	var mediaDir = "http://happyworm.com/clientarea/aj/video";
	var transcriptDir = "transcripts";  

	var latency = 1000;
        //console.log('start');                    
		// Grab the script from the URL
	var theScriptState = [];
	//var theScriptState = $.bbq.getState();  
		//console.dir(theScript);  
	var theScriptLength = theScript.length; 
		
		//console.log(theScript[0].m);         
	    //console.log(theScriptLength); 
		//console.log(theScript.length);   
		
		/*if (theScriptLength > 0) {   
			
			for (var i=0; i < theScriptLength; i++) {
				loadFile(theScript[i].m);
			}
			
		} else {
		  theScript = [];   
		} */
		
		
	var currentyLoaded = "";
	var hints = true;
	var playSource = true;
		

		
	var myPlayer = $("#jquery_jplayer_1");
	
	myPlayer.jPlayer({
		ready: function (event) {
			if(event.jPlayer.html.used && event.jPlayer.html.video.available) {
				//checkStartParam();
				//checkKeywordParam();
			}
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

	$.jPlayer.timeFormat.showHour = true;

	var i = 0;

	if (theScriptState[i] != false) { 
		 	while (theScriptState[i] != undefined) {
				//loadFile(theScriptState[i].m); 
                
				// repeated code use loadFile with a callback 
				
				//console.log('snippet --------------- > '+i);

				var timespan = {};
				timespan.s = parseInt(theScriptState[i].s);
				timespan.e = parseInt(theScriptState[i].e);  
				timespan.m = theScriptState[i].m; 
				
				//var id = theScriptState[i].m;
        var file = transcriptDir+'/'+timespan.m+'.htm'; 
				var mediaMp4 = mediaDir+'/'+timespan.m+'.mp4';
				var mediaWebM = mediaDir+'/'+timespan.m+'.webm';
				
				//console.log('file = '+audioogg);       
				//console.log(myPlayer.data('jPlayer').status.src);
				//timespan.src = myPlayer.data('jPlayer').status.src; 
				 
				
				theScript.push(timespan);  
				
				//console.log(theScriptState[i].s);   


				
				$.ajax({
				  url: file,
				  async: false,
				  success: function(data) {  

						//load success!!!     
						initPopcorn('#' + myPlayer.data("jPlayer").internal.video.id);      

						// load in the audio      

				  	myPlayer.jPlayer("setMedia", {
		        	m4v: mediaMp4,
		        	webmv: mediaWebM
		      	});

						$.data(myPlayer,'mediaId',timespan.m);

				  	$('#transcript-content').html(data); 

						//$('.scroll-panel').jScrollPane(); 
					
						// We need to paste the appropriate parts in the target pane here     
 
						var thisSpan = $('#transcript-content span[m="'+timespan.s+'"]');     
					      
						var endFound = false;
 
					
						var selectedStuff = $('<p i="'+i+'" s="'+timespan.s+'" e="'+timespan.e+'"  f="'+myPlayer.data('jPlayer').status.src+'">');
					 
						$('#target-content').append( selectedStuff ); 

						while (endFound == false) {

							$(thisSpan).clone().appendTo(selectedStuff);   
							thisSpan = thisSpan.next();    
							selectedStuff.append(' ');
							if (thisSpan.attr('m') == timespan.e) endFound = true; 
						} 

						$('#target-content').append('</p>');       

				  }
				});




				//while (theScript

				//$('#target-content').append();

				i++;
				//console.log('New snippet');      
			 } 
		   
		}  
		
		//console.log('EXITED');
   

		// These events are fired as play time increments  

		var playingWord = 1;    
		
		
		// transcript links to audio

		$('#transcript').delegate('span','click',function(e){ 
			playSource = true; 
			var jumpTo = $(this).attr('m')/1000; 
            //console.log('playing from '+jumpTo);
			myPlayer.jPlayer("play",jumpTo);  
			$('#play-btn-source').hide();
			$('#pause-btn-source').show();  
			console.log($(this).attr('m')/1000);

			/*e.stopPropagation();
			e.preventDefault(); 
    	e.stopImmediatePropagation();*/
			//console.log('click');

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
		     

		/* load in the file */  

		loadFile('debate08');
		//$('#transcript-content').css('top','540px');

		function initPopcorn(id) {   
			var p = Popcorn(id)
			.code({
			   start: 0,
		       end: 2000,
		       onStart: function (options) {
		         //console.log('start')
		       },
		       onFrame: (function () {

				// Warning: This might start polling before the transcript is loaded and ready.

		        var count = 0;
		        return function (options) {
					
            var now = this.Popcorn.instances[0].media.currentTime*1000;   
					
						var src = "";

						//console.log("now="+now+" end="+end+" theScript.length="+theScript.length+" index="+index+"playSource="+playSource);
					
						if (now > end && playSource == false) {   

          		// myPlayer.jPlayer("pause"); // MJP: Looks like old code. Commented out.
							index = parseInt(index);

							// check for the end

							if (theScript.length <= (index+1) && now > end) {
								myPlayer.jPlayer("pause");
							} 
							
							if (theScript.length > (index+1)) {  

								// moving to the next block in the target

								index = index + 1;       

								start = theScript[index].s;   
								end = theScript[index].e;

							
								myPlayer.bind($.jPlayer.event.progress + ".fixStart", function(event) {
									// Warning: The variable 'start' must not be changed before this handler is called.
							    $(this).unbind(".fixStart"); 
									$(this).jPlayer("play",start/1000);
								});     

				
								myPlayer.jPlayer("pause",start);   
							}    
						}   
		      }
		    })(),
		    onEnd: function (options) {
		         //console.log('end');
		    }
<<<<<<< HEAD
			});  

			$('.quality-switch').click(function(){
				var timeOnClick = currentTime;
				var quality = $(this).attr('q');
				//myPlayer.jPlayer('setMedia', {m4v: video[quality]});
				//myPlayer.jPlayer('play',timeOnClick);
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

=======
			}); 
			return p; 
		};
>>>>>>> 0b7bc7520c0fa95e9035ee3470d933a8aa69a081

		function initTranscript(p) {
			$("#transcript-content span").each(function(i) {  
				p.transcript({
					time: $(this).attr("m") / 1000, // seconds
					futureClass: "transcript-grey",
					target: this,
					onNewPara: function(parent) {
						console.log('para change');
						$("#transcript-content").stop().scrollTo($(parent), 800, {axis:'y',margin:true,offset:{top:0}});
					}
				});  
			});
		}

		$('rect,text').live('click',function(e){
			console.dir($(this));
			var top = $('#chart').offset().top;
			var height = $('#chart').height();
			//console.log(maxData);
			var piece = (maxData-1) - (Math.floor((e.clientY-top) / (height/maxData)));
			//console.log("piece="+piece);
			//console.dir($(this).index());
			//console.log(hitsDetails[$(this).index()][piece]);
			console.log("index="+$(this).index());
			// text items are placed next to rects affecting their indexes so we need to mod
			//console.log("hd len"+hits.length);
			var gIndex = $(this).index() % bars;
			console.log(gIndex);
			var m = hitsDetails[gIndex][piece];
			jumpTo = m/1000;
			console.log(jumpTo);
			myPlayer.jPlayer("play",jumpTo);  

			var $target = $('#transcript-content span[m="'+m+'"]').parent(); // The paragraph of the word.
			console.dir($target);
			console.log($target);
			$target = $target.prev().length ? $target.prev() : $target; // Select the previous paragraph if there is one.
			// Transcript has progressed beyond last paragraph, select last. Prevents crash in jquery
    	$target = $target.length ? $target : $("#transcript-content span").last().parent();
    
    	$("#transcript-content").stop().scrollTo($target, 1000, {axis:'y',margin:true});

    	_gaq.push(['_trackEvent', 'USElect', 'Bar chart clicked', 'Bar '+gIndex]);

			return false;
		});
		
		function loadFile(id) { 
			$('#main-loader').append('.');
			var file = transcriptDir+'/'+id+'.htm'; 
			var mediaMp4 = mediaDir+'/'+id+'.mp4';
			var mediaWebM = mediaDir+'/'+id+'.webm';
			
			//console.log('file = '+audioogg);
			 
			currentlyPlaying = id;

			//$('.direct').html('loading ...');

			var p = initPopcorn('#' + myPlayer.data("jPlayer").internal.video.id);   
			// load in the audio
			myPlayer.jPlayer("setMedia", {
				m4v: mediaMp4,
				webmv: mediaWebM,
				poster: "poster.png"
			});

			$('#load-status').html('loading ...');
			$('#transcript-content').load(file, function() {
			  	//load success!!!     

				initTranscript(p);

				$('#main-loader').append('.');

				$.data(myPlayer,'mediaId',id);
				$('#load-status').html('');

				if (hints == true) {
					$('#transcript-content-hint').fadeIn('slow');
					$('#transcript-file-hint').fadeOut('slow');
				}
				
				$('#source-header-ctrl').fadeIn();
				//console.log('loaded');
				
				countWords();

				checkStartParam();
				checkKeywordParam();
				//$('.jp-video-busy').show();
				//$('#transcript').animate({scrollTop: $("#page").offset().top}, 2000);
		
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
			
			if (tweetable.length > 88) {
				tweetable = tweetable.substr(0,85)+'...';
			}
			
	 		/*console.dir(select);    
			console.log(startSpan.getAttribute('oval'));    
			console.log(startSpan.getAttribute('m'));   
			console.log(endSpan.getAttribute('oval'));    
			console.log(endSpan.getAttribute('m'));   */
			      
			
			// Short and sweet      
			
			var s = Math.floor(parseInt(startSpan.getAttribute('m'))/100); 
			//var e = Math.floor(parseInt(endSpan.getAttribute('m'))/100);   
			
			// Make sure s < e
			
			/*/if (s > e) {
				var temp = e;
				e = s;
				s = temp;
			}*/
			  
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
			 
				var theTweet = "'"+tweetable+"' "+url+"?s="+s+" "+hashTag;//+"&e="+e;  
				 
				$('.share-snippet').empty();
				$('.share-snippet').append(theTweet);  
				$('#tweet-like').empty();
				$('#tweet-like').append('<script type="text/javascript" src="http://platform.twitter.com/widgets.js"></script><a data-url="" data-text="'+theTweet+'" href="http://twitter.com/share?url=x" class="twitter-share-button">Tweet</a>');  

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

		/* test stuff */

		$("#searchStr").keydown(function(e) {
    	if(e.which == 13) {
    		$('#search-btn').trigger('click');
        return false;
    	}
		});

		var speakerWords = [];

		function countWords() {
			var wordData = [];
			var speaker = "";
			var numWords = 0;
			speakerWords['d'] = 0;
			speakerWords['r'] = 0;
			speakerWords['m'] = 0;

			$('#transcript-content p').each(function(i) {
				if ($(this).children(':first').text().indexOf('BARACK OBAMA:') >= 0) {
					speakerWords['d'] = speakerWords['d'] + $(this).children().length;
				}

				if ($(this).children(':first').text().indexOf('JOHN MCCAIN:') >= 0) {
					speakerWords['r'] = speakerWords['r'] + $(this).children().length;
				}

				if ($(this).children(':first').text().indexOf('MODERATOR:') >= 0) {
					speakerWords['m'] = speakerWords['m'] + $(this).children().length;
				}

				
				//console.log('length='+$(this).children().length);
			});

			//console.dir(speakerWords);

			drawVisualization();
			$('#repWords').text(speakerWords['r']+" words");
			$('#demWords').text(speakerWords['d']+" words");
		}


		function drawVisualization() {

      var rPc = Math.round((speakerWords['r']/(speakerWords['r'] + speakerWords['d'])*1000))/10;
      var dPc = 100 - rPc;

      var piedata = [{"label":dPc+"%", "value":speakerWords['d']},{"label":rPc+"%", "value":speakerWords['r']}];

      drawPieChart(piedata);
    }


    function cleanWord(w) {
    	return w.toLowerCase().replace(".","").replace(",","").replace("!","").replace("?","").replace("-","")
    }

    var hitsDetails;


		$('#search-btn').click(function(){   

			hitsDetails = [];

			var searchStr = $('#searchStr').val().toLowerCase();

			console.log(searchStr);
			var matches = [];
			var speakers = [];
			var demCount = 0;
			var repCount = 0;

			$('#transcript-content span').css('background-color','white');

			$('#transcript-content span').each(function(i) {
				//console.log(i + ': ' + $(this).text() + ': '+ $(this).attr('m'));
				var searchWords = searchStr.split(" ");
				//console.dir(searchWords);
				if (searchWords[0] == cleanWord($(this).text())) {
					console.log(searchWords[0]+"="+cleanWord($(this).text()));
					var matching = true;
					if (searchWords.length == 1) {
						//$(this).css('background-color','yellow');
						
					} else {
						var nextWord = $(this).next();
						//console.dir("."+searchWords);

						for (var w=1; w < searchWords.length; w++) {
							console.log("sw="+searchWords[w]);
							console.log("nw="+nextWord.text());
							if (searchWords[w] != cleanWord(nextWord.text())) {
								console.log('matching is false');
								matching = false;
							}
							nextWord = nextWord.next();
						}
					}
					
					//console.dir(".."+searchWords);
					//console.log('check matching '+matching);

					
					if (matching == true) {

						

						//console.log('matching is true so colour code');

						var thisWord = $(this);
						
						//if (searchWords.length > 1) {
							//console.log('colour coding');
							/*for (var w=0; w < searchWords.length; w++) {
								thisWord.css('background-color','yellow');
								thisWord = thisWord.next();
							}	*/
						//}

						var timeSpan = {};
						timeSpan.s = parseInt($(this).attr('m'));
						timeSpan.e = parseInt($(this).attr('m'))+1000;
						theScript.push(timeSpan); 
						//console.log('match at '+$(this).attr('m')/60000);

						/*establish the speaker*/

						var wordElement = $(this).parent().children(':first');
						var word = wordElement.text();
						console.log('SPEAKER '+word);

						while (word.indexOf('BARACK OBAMA:') < 0 && word.indexOf('JOHN MCCAIN:') < 0 && word.indexOf('MODERATOR:') < 0) {
							
							console.log("CHECKING ...... "+word);

							wordElement = wordElement.parent().prev().children(':first');
							word = wordElement.text();
							
						}

						console.log("---> word is "+word);

						
						if (word.indexOf('BARACK OBAMA:') >= 0) {
							speakers.push('d');
							matches.push($(this).attr('m'));
							demCount++;
							if($('#demCb:checked').val()) {
								for (var w=0; w < searchWords.length; w++) {
									thisWord.css('background-color','yellow');
									thisWord = thisWord.next();
								}	
							}
						}

						if (word.indexOf('JOHN MCCAIN:') >= 0) {
							speakers.push('r');
							matches.push($(this).attr('m'));
							repCount++;
							if($('#repCb:checked').val()) {
								for (var w=0; w < searchWords.length; w++) {
									thisWord.css('background-color','yellow');
									thisWord = thisWord.next();
								}	
							}
						}

						if (word.indexOf('SPEAKER:') >= 0) {
							speakers.push('s');
						}
					}
				}

				// uncomment below to activate search term playback
				
				/*playSource = false;
				end = -1;
				index = 0;*/

				
				
			});

			//console.dir(matches);
			
			console.log('--speakers--');
			console.dir(speakers);
			//console.log('the Script ...');
			//console.dir(theScript);
			console.log('--matches--');
			console.dir(matches);

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

			console.dir(hits);
			console.dir(hitsDetails);

			for (var h=0; h < hits.length; h++) {
				data[h] = {};
				data[h].s = hits[h];
				//data[h].m = hitsDetails[h];
			}

			console.dir(data);

			drawBarChart(data);

			var rPc = Math.round((repCount/(repCount + demCount)*1000))/10;
      var dPc = 100 - rPc;

     	//var piedata = [{"label":rPc+"%", "value":speakerWords['r']},{"label":dPc+"%", "value":speakerWords['d']}];
      console.log(demCount);
      console.log(repCount);

      if (repCount == 0){
      	dPc = "";
      } else {
      	dPc = dPc + "%";
      }

      if (demCount == 0){
 				rPc = "";     	
      } else {
      	rPc = rPc + "%";
      }

      var piedata = [{"label":dPc, "value":demCount},{"label":rPc, "value":repCount}];

      drawPieChart(piedata);

      $('#repWords').text(repCount+" mentions");
			$('#demWords').text(demCount+" mentions");

			$('#pieTitle').text($('#searchStr').val());

			_gaq.push(['_trackEvent', 'USElect', 'Search ', 'Keyword(s) ='+searchStr]);

			return false;
		});

		function checkStartParam() {
			if (getUrlVars()["s"] != null) {    
				var s = parseInt(getUrlVars()["s"]);
				myPlayer.jPlayer("play",s/10);    
				_gaq.push(['_trackEvent', 'USElect', 'Start parameter', 'Triggered at '+s]);
			}
		}

		function checkKeywordParam() {
			if (getUrlVars()["k"] != null) {    
				var s = getUrlVars()["k"];
				console.log(s);
    		$('#searchStr').val(s);
    		$('#search-btn').trigger('click');
				_gaq.push(['_trackEvent', 'USElect', 'Keyword parameter', 'Triggered at '+s]);
			}
		}



		function getUrlVars() {
			console.log('checking url ....');
			var vars = [], hash;
			var myWindow = window;

			if (parent) {
				myWindow = parent.window;
			}

			var hashes = locationUrl.slice(locationUrl.indexOf('?') + 1).split('&');
			for(var i = 0; i < hashes.length; i++)
			{
				//console.dir(hashes[i]);
				hash = hashes[i].split('=');
				vars.push(hash[0]);
				vars[hash[0]] = hash[1];
			}

	    return vars;
	  }  

		$('#main-loader').append('.');
		
});    
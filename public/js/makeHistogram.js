/* CREATES MODAL HISTOGRAM */
function makeHistogram(){
	var Max = null
	var stdPopulation = function(){
		Max = d3.max(fullList, function(d,i){return fullList[i][currentAttribute]});

		return (allYearData.features).filter(function(d, i){ return d[damagesCurrent]!=0}).filter(function(d,i){return d[damagesCurrent].attributes[currentAttribute]>0}).map(function(d){return d[damagesCurrent].attributes[currentAttribute]}).sort(d3.ascending)
	}
	pickData=getCurrent()
	comparePopulation = function(){
		Max = d3.max(changeList, function(d,i){return changeList[i]});
		return (allYearData.features).filter(function(d,i){return d[damagesCompare]!=0}).map(function(d){return pickData(d)}).sort(d3.ascending)
	}

	population = (showCompareFeatures==true) ? comparePopulation() : stdPopulation()



	var values = population

	var formatCount = d3.format(",.00f");

	var margin = {top: 15, right: 30, bottom: 30, left: 40},
		width = $('#chartHolder').parents('.modal-body').width() - margin.left - margin.right,
		height = 400 - margin.top - margin.bottom;

	var x0 = Math.max(-d3.min(values), d3.max(values))

	var x = d3.scale.linear()
			.domain([d3.min(population), Max]).nice()
			.range([0, width]);

		var data = d3.layout.histogram()
			.bins(x.ticks(Max))
			(values);

		var y = d3.scale.linear()
			.domain([0, d3.max(data, function(d) { return d.y; })])
			.range([height, 0]);

	var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom");

	var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left");

	var colorScales=  ScaleEm('color')

	var svg = d3.select("#chartHolder").append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
			.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var bar = svg.selectAll(".bar")
			.data(data)
			.enter().append("g")
			.attr("class", "bar")
			.attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });


	 histobars = bar.append("rect")
			.attr('class', 'histobars')
			.attr("x", 1)
			.attr("width", function(){return x(data[0].x  + data[0].dx) - 1})
		.attr("height", 0)
			.attr("fill", function(d){return colorScales(d[0]);})
			.attr("y", function(d) { return height - y(d.y);});


	bar.append("text")
			.attr("dy", ".75em")
			.attr("y", -7)
			.attr("x", x(data[0].x  + data[0].dx)/2)
			.attr("bin", function(d){return (""+d.x+"-"+(d.x + d.dx)+"");})
			.attr("text-anchor", "middle")
			.text(function(d) { return formatCount(d.y);});

	svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);

	svg.append("g")
			.attr("class", "y axis")
			.call(yAxis);

	svg.append("text")
		.attr("transform", "translate(0," + (height+margin.bottom) + ") rotate(0)")
		.attr("x", (width/2))
		.style("text-anchor", "center")
		.attr("class", "axisLabel")
		.text(function(){ return(showCompareFeatures==false) ? aliases[currentAttribute] : "Net Difference in "+ aliases[currentAttribute]});

	svg.append("text")
		.attr("transform", "translate(-"+(margin.left)+","+margin.top+") rotate(-90)")
		.attr("x", -1*(height/2))
		.attr("y", 12)
		.style("text-anchor", "center")
		.attr("class", "axisLabel")
		.text("Frequency")

	var chartContents = d3.selectAll('text,.axis')
		.attr('opacity', 0)

	// setTimeout(function(){
		// $('#chartHolder').slideDown()
		animateHisto()
	// }, 200)


	function animateHisto(){
		chartContents
			.transition().delay(200).duration(600)
			.attr('opacity', 1)

		histobars
			.transition().delay(1000).duration(1000)
			.attr('y', 0)
			.attr('height', function(d) { return height - y(d.y);})
	}
}



function makePie(){

	currentColors = $('.draggable').map(function(){return $(this).attr('fill') }).get()
		pieData = [],
		totalPie = 0;

	pieTextScale = d3.scale.ordinal()
		.range($('.colorLegend').children().map(function(){return $(this).children('.stroke').text() }).get() )
		.domain($('.colorLegend').children().map(function(){return $(this).children('rect').attr('fill') }).get() )

	$(currentColors).each(function(){
		count = $('.colorful.symbols[fill="'+this+'"]').length
		pieceOfPie = {
			flavor: this,
			count: count,
			string: String(this)
		}
		pieData.push(pieceOfPie)
		totalPie+=count
	})

	var margin = {top: 10, right: 10, bottom: 10, left: 10},
		width = $('#chartHolder').parents('.modal-body').width() - margin.left - margin.right,
		height = 400 - margin.top - margin.bottom;
		radius = Math.min(width, height) / 2.5;

	var arc = d3.svg.arc()
			.outerRadius(radius * 0.8)
			.innerRadius(radius * 0.4);

	var outerArc = d3.svg.arc()
		.innerRadius(radius * 0.9)
		.outerRadius(radius * 0.9);

var pie = d3.layout.pie()
		.sort(null)
		.value(function(d) { return d.count; });

var svg = d3.select("#chartHolder").append("svg")
		.attr("width", width)
		.attr("height", height)
	.append("g")
		.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


var g = svg.selectAll(".arc")
		.data(pie(pieData))
	.enter().append("g")
		.attr("class", "arc");
svg.append("g")
	.attr("class", "labels");
svg.append("g")
	.attr("class", "lines");

var key = function(d){ return d.data.flavor; };

function midAngle(d){
		return d.startAngle + (d.endAngle - d.startAngle)/2;
	}

var piedata= pie(pieData)

	var slice = g.append("path")
		.attr('class', 'pieSlice')
		.attr("stroke-width", '0px')
		.style("fill", function(d) { return d.data.flavor; })
		.transition().delay(function(d, i) { return 500+(i* 500); }).duration(500)
		.attrTween('d', function(d) {
   			var I = d3.interpolate(d.startAngle+0.1, d.endAngle);
   				return function(t) {
      				d.endAngle = I(t);
      				return arc(d);
      			}
			})


	var text = svg.select(".labels").selectAll("text")
		.data(pie(pieData), key);

	text.enter()
		.append("text")
		.attr("dy", function(d){return (d.value<3) ? "0" : ".35em"})
		.text(function(d) { return (d.data.count==0) ? '' : pieTextScale(d.data.string);
		});
	text.transition().duration(1000)
		.attrTween("transform", function(d) {
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) {
				var d2 = interpolate(t);
				var pos = outerArc.centroid(d2);
				pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
				return "translate("+ pos +")";
			};
		})
		.styleTween("text-anchor", function(d){
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) {
				var d2 = interpolate(t);
				return midAngle(d2) < Math.PI ? "start":"end";
			};
		})
		.attr('opacity', 0)
		.transition().delay(function(d, i) { return 500+(i* 500); }).duration(500)
		.attr('opacity',  function(d){ return (d.data.count==0) ? 0 : 1 });



	var centerText = svg.append("text")
		.text(""+totalPie+"")
		.style({'text-anchor': 'middle','font-size': 'xx-large'})
		.attr('dy', '0.35em');
	svg.append("text")
		.text("parcels")
		.style({'text-anchor': 'middle','font-size': 'small'})
		.attr('dy', '30px')





	var polyline = svg.select(".lines").selectAll("polyline")
		.data(pie(pieData), key);

		console.log(pie(pieData), key)

	polyline.enter()
		.append("polyline");

	polyline.transition().duration(1000)
		.attrTween("points", function(d){
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			return function(t) {
				var d2 = interpolate(t);
				var pos = outerArc.centroid(d2);
				pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
				return [arc.centroid(d2), outerArc.centroid(d2), pos];
			};
		})
		.attr('opacity', 0)
		.transition().delay(function(d, i) { return 500+(i* 500); }).duration(500)
		.attr('opacity',  function(d){ return (d.data.count==0) ? 0 : 1 });


	d3.selectAll('.pieSlice')
		.on('mouseover', function(d){
			d3.select(this).attr("stroke-width", '3px')
			centerText.text(function(){ return d.data.count })
		})
		.on('mouseout', function(d){
			d3.select(this).attr("stroke-width", '0px')
			centerText.text(function(){ return totalPie }) })

}
yearDataLists=null
yearValues=null
yearKeys=null
scenarioData=null

function makeLine(){
	floods= ['2yr','5yr','10yr','25yr','50yr','100yr','2yr','5yr','10yr','25yr','50yr','100yr','2yr','5yr','10yr','25yr','50yr','100yr','2yr','5yr','10yr','25yr','50yr','100yr']
	chartColors= ['#fcc200', '#000080', '#14cad3', '#d1e231']
	scenarios = ['1. Current Precipitation & Land Use', '2. Future Precipitation & Land Use', '3. Current Precipitation with Green Infrastructure', '4. Future Precipitation with Green Infrastructure']



	var margin = {top: 80, right: 20, bottom: 40, left: 40},
			width = $('#chartHolder').parents('.modal-body').width() - margin.left - margin.right,
			height = 400 - margin.top - margin.bottom;

	var x = d3.scale.ordinal()
		.domain(floods)
		.rangePoints([0, width]);

	var y = d3.scale.linear()
			.range([height, 0]);

	var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom");

	var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left");

	var line = d3.svg.line()
			.x(function(d) { return x(d.floodType); })
			.y(function(d) { return y(d3.max(d[currentAttribute])); });

	var sumline = d3.svg.line()
			.x(function(d) { return x(d.floodType); })
			.y(function(d) { return y(d3.sum(d[currentAttribute])); });

	var meanline = d3.svg.line()
		.x(function(d) { return x(d.floodType); })
		.y(function(d) { return y(d3.mean(d[currentAttribute])); });

	var straightline = d3.svg.line()
			.x(function(d) { return x(d.floodType); })
			.y(function(d) { return y(0); });

	var SVG = d3.select("#chartHolder").append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
	var svg= SVG.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")")

	var xaxis = svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
	.append("text")
		.attr("transform", "translate(0," + margin.bottom + ") rotate(0)")
		.attr("x", width/2)
		.style("text-anchor", "center")
		.attr("class", "axisLabel")
		.text("Flood Event");





		var scenarioLength = $('[name="scenarioRadios"]').length,
			possibleAttributes = $('#fieldSelector option').map(function(){return $(this).attr('value')}).get()
			chartData =[]

		//yearValues = d3.keys(dataByYear)
			//yearObjects = d3.map(dataByYear).entries()
			// d3.map(dataByYear[6]).entries().forEach(function(d){console.log(d['value'].attributes[currentAttribute])})
			scenarioData = $('[name="scenarioRadios"]').map(function(){
				start = parseInt($(this).attr('data-udf'))
				Width = parseInt($(this).attr('data-width'))
				end = start + Width
				scenario = parseInt($(this).attr('value'))
				scenarioI = scenario-1
				return ({start : start, end: end, scenario: scenario, scenarioI: scenarioI, width:Width})
			}).get()


			max_BldgDmgPct=[]
			max_BldgLossUS=[]
			sum_BldgLossUS=[]
			yearDataLists = []
			yearValues=d3.values(dataByYear)
			yearKeys= d3.keys(dataByYear)
			formLists = (yearValues).forEach(function(d,i){
				percent= $(d3.values(d)).map(function(){return this.attributes.BldgDmgPct}).get()
				dollars= $(d3.values(d)).map(function(){return this.attributes.BldgLossUS}).get()
				max_BldgDmgPct.push(d3.max(percent))
				max_BldgLossUS.push(d3.max(dollars))
				sum_BldgLossUS.push(d3.sum(dollars))
				yearIndex= yearKeys[i]
				floodType= floods[i]
				yearDataLists.push({BldgDmgPct:percent, BldgLossUS:dollars, yearIndex: yearIndex, floodType:floodType})
			})


			$(scenarioData).each(function(){

				cutStart = (this.width*this.scenarioI)
				cutEnd = (this.width*this.scenarioI)+this.width
				s = (yearDataLists.slice(cutStart,cutEnd))
				this['floodEventData']=s
				this['cutStart']=cutStart
				this['cutEnd']=cutEnd

			})


		function makeLegend (){
			var legends= SVG.append("g")
					.attr("width", width + margin.left + margin.right)
					.attr("height", margin.top)
					.attr("transform", "translate(" + margin.left + ",10)")
					.attr("class", "lineChartLegend")

			var label = legends.selectAll("labelGroups")
				.data([0,1,2,3])
				.enter().append("g")
					.attr("transform", function(d){ return "translate(0,"+(d*15)+")" });

			label.append('text')
				.attr('dy','.7em')
				.attr("transform", function(d){ return "translate(25,0)" })
				.text(function(d){return scenarios[d]});

			label.append('line')
				.attr('x1',0)
				.attr('y1', 5)
				.attr('x2', 20)
				.attr('y2', 5)
				.attr('stroke', function(d){ return chartColors[d]})
				.attr('stroke-width', 3)
				makeLine()
		}
		if ($('.lineChartLegend').length==0){
			makeLegend()
		}else{
			styleLines(d3.selectAll('.lines'))
		}


		function makeLine(){
			setDomain = (currentAttribute=='BldgLossUS') ? y.domain([0, d3.max(max_BldgLossUS)]) : y.domain([0, d3.max(max_BldgDmgPct)])

				var yaxis = svg.append("g")
					.attr("class", "y axis line-yAxis")
					.call(yAxis)
				.append("text")
					.attr("transform", "translate(-" + margin.left + ","+ height/2 +"), rotate(-90)")
					.attr('dy','.7em')
					.attr('text-anchor','middle')
					.attr("class", "axisLabel")
					.text(function(){return(currentAttribute=='BldgLossUS')?"Flood Damages (thousands of $)":"Flood Damages (%)"});

				var lineGroup = svg.selectAll(".lineGroup")
					.data(scenarioData)
					.enter().append("g")
						.attr("class", "lineGroup")
				lines = lineGroup.append("path")
					.attr("class", "line")
					.attr('d', function(d){ return straightline(d.floodEventData)})
					.attr('stroke',function(d,i){return chartColors[i]})
					.attr('stroke-opacity', .8)
					.call(styleLines)
		}


		function styleLines(lines){
			function currentStat(){
				function getMean(x){ return d3.mean(x) }
				function getMax(x){ return d3.max(x) }
				function getSum(x){ return d3.sum(x) }
				function getN(x){ return x.length }
				function getMed(x){ return d3.median(x) }

				return ($("#select-stats option:selected").val()=="mean") ? getMean:
						($("#select-stats option:selected").val()=="max") ? getMax:
						($("#select-stats option:selected").val()=="med") ? getMed:
						($("#select-stats option:selected").val()=="n") ? getN : getSum
			}
			doMath = currentStat()

			newDomain = d3.max(yearDataLists.map(function(d,i){ return doMath(d[currentAttribute]); }))
			y.domain([0, newDomain])
			d3.selectAll('.line-yAxis').remove();

			var yaxis = svg.append("g")
					.attr("class", "y axis line-yAxis")
					.call(yAxis)
				.append("text")
					.attr("transform", "translate(-" + margin.left + ","+ height/2 +"), rotate(-90)")
					.attr('dy','.7em')
					.attr('text-anchor','middle')
					.attr("class", "axisLabel")
					.text(function(){return ($("#select-stats option:selected").val()=="n") ? "Total Number of Innundated Parcels" : (currentAttribute=='BldgLossUS')?""+$('#select-stats option:selected').html()+" (thousands of $)":""+$('#select-stats option:selected').html()+" (% Damage)"});
			$('#helpText .statistic-help').html(function(){ return ($("#select-stats option:selected").val()=="n") ? "Total Number of Innundated Parcels" : (currentAttribute=='BldgLossUS')?""+$('#select-stats option:selected').html()+" (measured in thousands of dollars)":""+$('#select-stats option:selected').html()+" (measured in percent damage)"})


			line.y(function(d) { return y(doMath(d[currentAttribute])); });

			lines
				.transition().duration(1000).delay(1000)
				.attr('d', function(d){ return line(d.floodEventData)})
		}

		$("#select-stats").on("change", function(){
			console.log("change")
			styleLines(d3.selectAll('.line'))
		})










}




$('.chartSelector').on('click', function(){
	$('#chartHolder').empty()
	$('#helpText').children().hide()

	chartType = $(this).attr('data')
	$('#helpText>#'+chartType+'-help').show()
	$('#helpText .floodevent-help').html(function(){ return $('[name="floodEventRadios"]:checked').attr('year')})
	$('#helpText .scenario-help').html(function(){ return $('#dataHeading .panel-subtitle').html()})
	$('#helpText .attribute-help').html(function(){ return (currentAttribute=='BldgLossUS') ? 'Thousands of Dollars' : 'Percent Damage' })
	$('#chartModal .modal-title').html(function(){return (chartType=='histogram') ? "histogram" : (chartType=='pie') ? 'Affected Parcels Breakdown': 'Watershed-Level Trends' })
	hideDropDown = (chartType!='line')? $(".line-only").hide() : $(".line-only").show()
	if (currentAttribute!='BldgLossUS') {
		$('#select-stats option[value="sum"]').attr("disabled", "disabled")
	}else{
		$('#select-stats option[value="sum"]').removeAttr("disabled")
	}
	$('#select-stats').selectpicker('refresh')
	setTimeout(function() {
				makeChart = (chartType=='histogram') ? makeHistogram():
					(chartType=='pie') ? makePie() :
					(chartType=='line') ? makeLine() : null
		}, 250);
})

$('.printer').on('click', function(){
	target = $(this).attr('data')
	$(target).print({stylesheet:"../css/printing.css"})
})

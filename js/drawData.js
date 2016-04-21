// Initialize  svg overlay pane
map._initPathRoot();

// Map
var mapsvg = d3.select("#map")
			   .select("svg"),
	mapSymbolGroup= mapsvg.append("g");

var transform = d3.geo.transform({point: projectPoint}),
	path = d3.geo.path().projection(transform);

function projectPoint(x, y) {
	var point = map.latLngToLayerPoint(new L.LatLng(y, x));
		this.stream.point(point.x, point.y);
};

// Chart
var chartMargin = {top: 20, right: 20, bottom: 25, left: 45},
	chartWidth = ($('#page-content-wrapper').width()) - (chartMargin.left + chartMargin.right),
	chartHeight = $("#chart").height() - chartMargin.top - chartMargin.bottom;


var chartsvg = d3.select("#chart")
		.append("svg")
		.attr("id", "chartsvg")
		.attr('width', chartWidth + chartMargin.left + chartMargin.right )
		.attr('height', chartHeight + chartMargin.top + chartMargin.bottom)
		.append("g")
			.attr("class", "mainChart")
			.attr("transform", "translate(" + chartMargin.left + "," + chartMargin.top + ")");

// Drag Behavior in Legend
var dragging= false;
var drag = d3.behavior.drag()
	.origin(Object)
	.on("dragstart", function(d){dragging = true;})
	.on("drag", function(d){d3.select(this).attr("y", function(){return parseInt(d3.select(this).attr('y'))+parseInt(d3.select(d3.event)[0][0].dy)})})
	.on("dragend", function(){ dragging = false; chooseCustom();});


// Legend
var haz_m = {top: 20, bottom:10, left: 10, right: 10},
	haz_w = (270-haz_m.left-haz_m.right),
	haz_h = (200-haz_m.top-haz_m.bottom);

var hazSVG = d3.select('#floodHazardsLegend')
	.append('svg')
	.attr('width', haz_w+haz_m.left+haz_m.right)
	.attr('height', haz_h+haz_m.top+haz_m.bottom)
	.attr('id', 'hazardLegendSVG')
		.append('g')
		.attr('transform', function(){return'translate('+haz_m.left+','+haz_m.top+')'});


// Creates bar chart, legend, and proportional symbol elements when the map is first initialized
function createSymbols(data){
	// Proportional symbols on map
	var symbols = mapSymbolGroup.selectAll('circle')
		.data(data.features)
		.enter().append('circle')
		.attr('fill', colors[currentAttribute][0])
		.attr('stroke', function(d){d["prev"]=0;return'white'})
		.attr('stroke-width', 0)
		.attr('width', 0)
		.attr('height',0)
		.attr('class', 'colorful symbols')
		.attr('id', function(d){ return 'ID_'+d.id+''})
		.attr('r', 0)
		.on('click', function(d){ openPop(d.id) });
		map.on("viewreset", update);

	// Reposition the symbols when mapview changes
	function update(){
		symbols.attr("cx",function(d) { return map.latLngToLayerPoint(d.LatLng).x})
			.attr("cy",function(d) { return map.latLngToLayerPoint(d.LatLng).y});

	}
	update();

	// Main Chart
	var barGroup= chartsvg.append("g")
		.attr('class', 'barGroup');
	var bars = barGroup.selectAll("rect")
		.data(data.features)
		.enter().append('rect')
		.attr('id', function(d){ return 'ID_'+d.id+''})
		.attr('stroke-width', 0)
		.attr("stroke", "white")
		.attr('class', 'colorful bars')
		.attr('width', 0)
		.attr('height', 0)
		.attr('x',function(d,i){return i*$(this).attr('width') })
		.attr('y',function(){return chartHeight - $(this).attr('height') })
		.on('click', function(d){return map.setView(d.LatLng, 16)});

	// +/- Change Labels
	/*
	chartsvg.append("text")
		.attr('class', 'increasedDamages')
		.attr("text-anchor", "end")
		.attr('opacity', 0)
	chartsvg.append("text")
		.attr('class', 'decreasedDamages')
		.attr("text-anchor", "begining")
		.attr('opacity', 0)
	*/

	// BreakLines
	var breakLineGroup = chartsvg.append("g")
		.attr('class', 'breakLineGroup');
	var breakLines= breakLineGroup.selectAll(".breakLines")
		.data(d3.range(5))
		.enter().append("rect")
		.attr("class", "draggable")
		.call(drag);


	// Main Chart Axis Labels
	chartsvg.append("text")
		.attr('class', 'mainChartY')
		.attr("text-anchor", "middle")
		.attr('opacity', 0)
	chartsvg.append("text")
		.attr('class', 'mainChartX')
		.attr("text-anchor", "middle")
		.attr('opacity', 0);
	chartsvg.append("text")
		.attr('class', 'mainChartTitle')
		.attr("text-anchor", "middle")
		.attr('opacity', 0);



	// Attach coordinated highlighting between symbols and bars
	d3.selectAll('.colorful')
		.on("mouseover", function(event){
			var target= $(this).attr('id');
			d3.selectAll('#'+target+'').classed({'hover':true})
			return (dragging==false) ? d3.selectAll('#'+target+'.bars').moveToFront():null
		})
		.on("mouseout", function(event){
			var target= $(this).attr('id');
			d3.selectAll('#'+target+'').classed({'hover':false})
		})

	// flood hazards legend elements explaining color symbology
	var colorLegend = hazSVG.append('g')
		.attr('class', 'colorLegend')
			.selectAll('.colorGroup')
			.data(function(){ return d3.range(5).reverse()})
			.enter().append('g')
			.attr('transform', function(d,i){return 'translate('+((haz_w/5)*i)+',0)'});
		colorLegend.append('rect')
				.attr('width', 0)
				.attr('height', 50)
				.attr('class','legendSymbols')
		colorLegend.append('text').attr('class', 'halo')
		colorLegend.append('text').attr('class', 'stroke')

	// flood hazards legend elements explaining size symbology
	var sizeLegend = hazSVG.append('g')
		.attr('class','sizeLegend')
		.selectAll('.sizeLegendGroup')
			.data(function(){ return d3.range(5).reverse()})
			.enter().append('g')
			.attr('transform', function(d,i){return 'translate('+((haz_w/6)*(i+1))+','+(haz_h*.75)+')'});
		sizeLegend.append('circle')
			.attr('r',0)
			.attr('class', 'legendSymbols')
		sizeLegend.append('text').attr('y',(haz_h*.25))

	// legendHeadings
	var headings = hazSVG.append('g')
		.attr('class', 'headings')
			.selectAll('.heading')
			.data(function(){ return d3.range(2).reverse()})
			.enter().append('text')
				.attr('class', 'legendHeading')
				.attr("transform", function(d,i){return "translate("+(haz_w/2)+","+(((haz_h/2)*i)-haz_m.top)+")"})
				.attr('dy','1em');


	handleStyle()
	drawWater =($(watershedCheck).is(':checked'))? drawWatershed() : null
	drawLand = ($(landUseCheck).is(':checked'))? drawLandUse() : null
}


function style(){
	// Defines function to expose the current data (ie. the dataset according the current scenario, flood event, and attribute selected)
	var pickData = getCurrent()
		// changeList=(showCompareFeatures==true) ? ($(allYearData.features).map(function(){return pickData(this)}).get()).sort(d3.descending) :[]
		// changeList.sort(d3.descending)

	var selectedData= d3.selectAll('.bars').data().map(function(d){return pickData(d)}).filter(function(d){return d!=0}).sort(function(a,b){return d3.descending(Math.abs(a), Math.abs(b) )})
		maxWidth = chartWidth/(selectedData.length)

	// Retrieve scales from dispatcher function
	var colorScale = ScaleEm('color'),
		linearHeight = ScaleEm('height'),
		radiScale = ScaleEm('radius');

	var breaks = colorScale.domain();

	// Update y axis
	var chartYaxis = d3.svg.axis()
		.scale(linearHeight)
		.orient("left")
		.tickValues(breaks);

	d3.select("#chartsvg .y.axis").remove();


	chartsvg.append("g")
		.attr("class", "y axis")
		.call(chartYaxis);

	function updateLables(){
		// Update increase/decrease labels
		// d3.select(".increasedDamages")
		// 	.transition().duration(500)
		// 	.attr('opacity', 0)
		// 	.text("Increased Flood Damages**")
		// 	.attr("transform", function(){return "translate("+(chartWidth- (maxWidth*d3.selectAll('.bars').filter(function(d,i){return pickData(d)>4})[0].length))+","+(linearHeight(5))+")"})
		// 	.transition().duration(1000)//.delay(2000)
		// 	.attr('opacity', function(){return (showCompareFeatures==false)?0:1});
		// d3.select('.decreasedDamages')
		// 	.transition().duration(500)
		// 	.attr('opacity', 0)
		// 	.text(function(){return(showCompareFeatures==false)?"Flood Damages": "Decreased Flood Damages"})
		// 	.attr("transform", function(){return (showCompareFeatures==false)?"translate(-"+chartMargin.left+","+10+")": "translate("+((maxWidth*d3.selectAll('.bars').filter(function(d,i){return pickData(d)<-13})[0].length))+","+(linearHeight(-15))+")"})
		// 	.transition().duration(1000)//.delay(2000)
		// 	.attr('opacity', function(){return (showCompareFeatures==false)?0:1});

		// Update main chart labels
		d3.selectAll('.mainChartY')
			.transition().duration(500)
			.attr('opacity', 0)
			.text(function(){return(showCompareFeatures==false)?"Flood Damages": "Change in Flood Damages"})
			.attr("transform", function(){return"translate(-30,"+(chartHeight/2)+") rotate(270)"})
			.transition().delay(2000).duration(1000)
			.attr('opacity', 1);
		d3.selectAll('.mainChartX')
			.transition().duration(500)
			.attr('opacity', 0)
			.text("Parcels in the Silver Creek watershed")
			.attr("transform", function(){return "translate("+(chartWidth/2)+","+(chartHeight+chartMargin.top)+")"})
			.transition().delay(2000).duration(1000)
			.attr('opacity', 1);

		d3.selectAll('.bars').sort(function(a,b){return (showCompareFeatures==false) ? d3.descending(pickData(a), pickData(b)) : d3.ascending(pickData(a), pickData(b))});		//.sort(function(a,b){return d3.descending(Math.abs(pickData(a)), Math.abs(pickData(b)))})[0]

		updateSymbology();
	}
	updateLables();

	function updateSymbology(){
		// Update main chart bar symbology
		d3.selectAll('.bars').filter(function(d,i){return pickData(d)!=0})
			.attr('height', function(d){return (showCompareFeatures!=true) ? (chartHeight-linearHeight(pickData(d))) : (Math.abs(linearHeight(pickData(d)) - linearHeight(0)))})
			.transition().duration(2000)
			.attr("fill", function(d){return colorScale(pickData(d))})
			.attr("opacity", 1)//function(d){return ((showCompareFeatures==true)&&(d[damagesCurrent]==0))? 0.7 : ((showCompareFeatures==true)&&(d[damagesCompare]==0)) ? 0.7 : 1})
			.attr('y', function(d){return (showCompareFeatures!=true) ? linearHeight(pickData(d)) : linearHeight(Math.max(0, pickData(d)))})
			.transition().duration(1000)//.delay(1000)
			.attr('width', function(){return maxWidth})
			.attr('x', function(d,i){return i*maxWidth});
		d3.selectAll('.bars').filter(function(d,i){return pickData(d)==0})
			.transition().duration(1000)
			.attr('width', 0)
			.attr('height', 0)
			.transition().delay(1000).duration(1000)//
			.attr('y', 0);


		// Update map symbol symbology
		d3.selectAll('.symbols').filter(function(d,i){return pickData(d)!=0}).sort().sort(function(a,b){return d3.descending(Math.abs(pickData(a)), Math.abs(pickData(b)))})
			.attr("stroke", function(d){return (d.prev < radiScale(pickData(d)))? "white": d3.lab(d3.select(this).attr("fill")).darker()})//<radiScale(pickData(d))) ? "white" : "black" })
			.attr("stroke-width", 2)
			.transition().duration(2000)
			.attr("stroke", function(d){return colorScale(pickData(d))})
			.attr("stroke-width", 0)
			.attr("r", function(d){ d["prev"]=radiScale(pickData(d)); return ($('input[name="layerCheckboxes"]:eq(0)').is(':checked')==true) ? radiScale(pickData(d)) : 0})
			.attr("fill", function(d){return colorScale(pickData(d))})
			.attr("fill-opacity", 0.7)//function(d){return ((showCompareFeatures==true)&&(d[damagesCurrent]==0))?0.4 : ((showCompareFeatures==true)&&(d[damagesCompare]==0)) ? 0.4 : 0.7});
			.attr("stroke-opacity", 1);
		d3.selectAll('.symbols').filter(function(d,i){return pickData(d)==0})
			.attr("stroke-width", 2)
			.attr("stroke", function(d){ return d3.lab(d3.select(this).attr("fill")).darker()})
			.transition().delay(1000).duration(2000)
			.attr("r", function(d){d["prev"]=0; return 0})
			.attr("stroke-width", 0);

			makeTicks();
	}


}




function makeTicks(){

	var colorScale = ScaleEm('color'),
		linearHeight = ScaleEm('height'),
		rScale= ScaleEm('radius');

	var evenBreaks = ScaleEm('color', null, "equalInterval").domain()


	var breaks = ($('#scaleSelector option:selected').val()=="quantile_Color") ? colorScale.quantiles() : colorScale.domain();
		textScale = d3.scale.ordinal()
			.domain([555, 333, 111,4,0])
			.range(['More Change', 'Less Change', 'More Change (-)','More Damages', 'Less Damages'])


	d3.selectAll('.draggable')
			.data(breaks)
			.attr('x', 0)
			.attr('height', 3)
			.attr('fill', function(d,i){return colorScale(d)})
			.transition().delay(500).duration(1000)
			.attr('y', function(d){return linearHeight(d)})
			.attr('width', chartWidth);

	d3.selectAll('.colorLegend rect')
		.transition().duration(500)
		.attr('fill', function(d){ return colorScale(breaks[d])})
		.transition().duration(1000)
		.attr('width', 50);

	d3.selectAll('.sizeLegend g').sort(function(a,b){ return d3.descending(Math.abs(breaks[a]), Math.abs(breaks[b]) )})

	d3.selectAll('.sizeLegend circle')
		.transition().duration(600)
		.attr('r', function(d){return (rScale(evenBreaks[d])>3)?rScale(evenBreaks[d]):3})
		.attr('fill', function(d){ return colorScale(breaks[d]) });

	d3.selectAll('.colorLegend text')
		.text('')
		.attr('x', 25)
		.attr('text-anchor', 'middle')
		.attr("dy", '1.3em')
		.transition().duration(500)
		.text(function(d){return (breaks[d+1]!=undefined) ? (d3.round(breaks[d])+' - '+(d3.round(breaks[d+1])-1) +'%'): (d3.round(breaks[d])+"% +")});
	d3.selectAll('.legendHeading')
		.transition().delay(500).duration(1000)
		.text(function(d){return (d==0) ? 'Size' : 'Color'});
	d3.selectAll('.sizeLegend text')
		.text('')
		.attr('dy', '.5em')
		.filter(function(d,i){return (showCompareFeatures==true)? (d<1||d==2||d>3) :(d<1||d>3); })
		.transition().delay(500).duration(1000)
		.text(function(d, i){ return (showCompareFeatures==true)? textScale((d+1)*111): textScale(d)});

 }

 function chooseCustom(){

	var linearHeight = clone(ScaleEm('height'));

	var reverser = d3.scale.linear()
		.domain(linearHeight.range())
		.range(linearHeight.domain());

	var draggableValues = $('.draggable').map(function(){ return (reverser(parseInt($(this).attr('y')))) }).get();

	var suffix = (showCompareFeatures==true) ? '_change' : ''

	customExists[String(currentAttribute)+suffix]=draggableValues

	$('#scaleSelector').selectpicker('val', 'custom');

	$(".resetBreaks").show()
	handleStyle();
 }
$(".resetBreaks").click(function(){
	$('#scaleSelector').selectpicker('val', 'jenks');
	handleStyle();
	$(this).hide()
})


function chartResize(){
	chartWidth = $('#page-content-wrapper').width() - (chartMargin.left + chartMargin.right)
	chartHeight = $("#chart").height() - chartMargin.top - chartMargin.bottom

	d3.select('#chartsvg')
		.attr('width', $('#page-content-wrapper').width())
		.attr('height',chartHeight + chartMargin.top + chartMargin.bottom)

	chartsvg
		.transition().duration(1000).delay(200)
		.attr('width', chartWidth )
		.attr( 'height', chartHeight );

	handleStyle();
}


function handleStyle(){
	style();
	setTimeout(function(){
		$('#baseText').html(function(){return getBaseText()});
	}, 500);
	updateStatistics()
	// updateHighlights();
	destroyPop()
}

// Updates the Highlighted Scenario Text to Match the Selection
// function updateHighlights () {
//     function changeHighlights (){
//     $('[name="scenarioRadios"][data-udf='+$('[name="scenarioRadios"]:checked').attr('data-compare-'+compareType+'')+']').parents('.list-group-item').addClass('compare')
//     $('[name="scenarioRadios"][data-udf='+$('[name="scenarioRadios"]:checked').attr('data-compare-'+compareType+'')+']').parents('.list-group-item').siblings().removeClass('compare')
//     }
//     function removeHighlights(){
//         $('.list-group-item.compare').removeClass('compare')
//     }
//     return (showCompareFeatures==true) ? changeHighlights() : removeHighlights()
// }


// Creates Summary Stats for the population
function updateStatistics(x){

	population = (x==undefined) ? d3.values(dataByYear[damagesCurrent]).map(function(d){return d.attributes[currentAttribute]}) : x.map(function(d){return d[damagesCurrent].attributes[currentAttribute]})
	form = (currentAttribute=="BldgDmgPct") ? d3.format('%') : d3.format('$,')
	math  = (currentAttribute=="BldgDmgPct") ? function(x){return x/100} : function(x){return x*1000}

	stats= {
		mean : form(math(d3.round(d3.mean(population)))),
		median : form(math(d3.round(d3.median(population)))),
		sum : form(math(d3.round(d3.sum(population)))),
		n : String(population.length)
	}

	$('.stats-target').each(function(){ $(this).html(stats[$(this).attr('data')]) })
	return (currentAttribute=="BldgDmgPct") ? $('.stats-target[data="sum"]').parent().slideUp() : $('.stats-target[data="sum"]').parent().slideDown()

}
// Returns the Explanatory Legend Text
function getBaseText(){
	var floodYear = $('[name="floodEventRadios"]:checked').attr("year")
		scenario = String($('[name="scenarioRadios"]:checked').parent().text()).toLowerCase()
		attribute = (currentAttribute=="BldgLossUS") ? "thousands of dollars" : "percent damage"


	var scenarioText = getScenarios()
	var outputText = "<p class='legendDescText'>{&nbsp;displayed "
		outputText = (showCompareFeatures==true) ? outputText.concat("as the net difference ") : outputText
		outputText = outputText.concat("in <strong>"+attribute+"</strong> resulting from a <strong>"+floodYear+" year flood</strong>")
		outputText = (showCompareFeatures==true) ?  outputText.concat(" between scenario "+($('.list-group-item.active').index()+1)+" and scenario "+($('.list-group-item.compare').index()+1)+" }") : outputText.concat(", given <strong>"+scenario+"</strong>&nbsp;}</p>")

	return outputText
}
// Reposition the SVG to cover the features.
function resetTopoJson(t) {
	t.attr("d", path);
}

// Creates the Watershed layer || Called When the watershed checkbox is first clicked
function drawWatershed(){

	var watershed = mapsvg.selectAll(".watersheds")
		.data(topojson.feature(silverCreekWatershed_topo, silverCreekWatershed_topo.objects.watershed).features)
		.enter().append("path")
		.attr("d", path)
		.attr("class", "watershed")
		.attr("stroke-width", 0)
		.attr("stroke", "turquoise")
		.attr("fill-opacity", 0)
		.moveToBack()
		.call(styleWatershed)
		.call(resetTopoJson);

	map.on("viewreset", function(){resetTopoJson(watershed)});
	watershedCheck.on('change', styleWatershed)
}

function handleLandUse(){
	var LU = $('[name="landUseRadios"]:checked').val()

	return ($("."+LU+"").length==0) ? drawLandUse(LU) : styleLandUse(LU)
}
$('[name="landUseRadios"]').on('change', handleLandUse)


// Creates the Land Use layer || Called When the land use checkbox is first clicked
function drawLandUse(landUse){

	var landUseColors =d3.scale.ordinal()
		.domain(["Commercial", "Green Space", "Industrial", "Institutional Campus", "Other", "Residential"])
		.range(["#838faa", "#00aa00", "#4d4d4d", "#ffaa7f", "#ff8e90", "#fff47b"])


		var landUseZones = mapsvg.selectAll("landUseZones")
			.data(function(){
				var x = (landUse=="FLU") ? futureLandUse_topo : currentLandUse_topo;
			 	return topojson.feature(x, x.objects.LU_TYPES).features })
			.enter().append("path")
			.attr("d", path)
			.attr("class", function(){return "landUseZones "+landUse+""})
			.attr("fill", function(d){ return landUseColors(d.properties.Lu_Sum)})
			.attr("fill-opacity", 0)
			.moveToBack()
			.call(resetTopoJson);
			styleLandUse(landUse);


		map.on("viewreset", function(){resetTopoJson(landUseZones)});

		 var makeLegend = ($('#landUseLegendSVG').length==0) ? makelandUseLegend() : null


	function makelandUseLegend(){
		var m = {top: 5, right: 5, bottom: 5, left: 5},
			H = 15,
			W = 40;

		var landUseLegendSVG = d3.select("#landUseLegend")
			.append("svg")
			.attr('height', function(){ return ((landUseColors.domain()).length * (H+m.top)); })
			.attr('width', 300)
			.attr('id', 'landUseLegendSVG')
			.append('g')
			.attr("transform", "translate(" + m.left + "," + m.top + ")");


		var legendGroup = landUseLegendSVG.selectAll('.legendGroup')
			.data(landUseColors.domain())
			.enter().append('g')
			.attr("transform", function(d, i) { return "translate(0," + i * (H+m.top) + ")"; });

		legendGroup.append('rect')
			.attr("width", W)
			.attr("height", H)
			.attr("fill", function(d){return landUseColors(d)});

		legendGroup.append("text")
			.attr("x", W+m.right)
			.attr("y", H/2)
			.attr("dy", ".35em")
			.text(function(d) { return d ;});

	}
}
// Turns the land use layer on and off after it is created
function styleLandUse(landUse){
	d3.selectAll('.landUseZones')
		.attr('fill-opacity', 0).transition().duration(600)

	d3.selectAll('.'+landUse+'').transition().duration(600)
		.attr("fill-opacity", function(){return ($(landUseCheck).is(':checked')) ? .8 : 0 })

	var showLegend = ($(landUseCheck).is(':checked')==false) ? $('#landUsePanel').parents('.panel:first').slideUp() : $('#landUsePanel').parents('.panel:first').slideDown()

}
// Turns the watershed layer on and off after it is first created
function styleWatershed(watershed){
	d3.selectAll('.watershed').transition().duration(600)
		.attr('stroke-width', function(){ return watershedCheck.is(':checked') ? 5 : 0 })

}

// rr= null
// dd= null
// function filterByMapView(){
// 	colorScale = ScaleEm('color')
// 	pickData = getCurrent()
// 	bb = L.latLngBounds(map.getBounds())
// 	rr = d3.selectAll('.bars').filter(function(d, i){return (bb.contains(L.latLng(d.LatLng)) && (pickData(d)!=0)) })
// 	dd = rr[0].map(function(d,i){ return (d.__data__)})
// 	updateStatistics(dd)
// }

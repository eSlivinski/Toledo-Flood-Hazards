/*
    Created By Lizzi Slivinski, 2014 - 2015
    eSlivinski@gmail.com

    makePopup.js  Document creates popups and popupcharts
*/

function keepInView(){
	var popPadding=10,
		navHeaderHeight = 50,
		maxtop =(navHeaderHeight + popPadding);


	function moveDown(){ return ($('.symbolPop').position().top<maxtop) ? $('.symbolPop').position().top-maxtop : 0; }
	function moveRight(){ return ($('#page-content-wrapper').position().left - $('.symbolPop').position().left > 0) ? -1*($('#page-content-wrapper').position().left - $('.symbolPop').position().left) : 0 }
	function moveLeft() { return (($('.symbolPop').position().left+$('.symbolPop').outerWidth())> $('#page-content-wrapper').width()) ? (($('.symbolPop').position().left+$('.symbolPop').outerWidth()) - $('#page-content-wrapper').width()) : 0}

	moveDown= moveDown()
	moveRight = moveRight()
	moveLeft = moveLeft()

	if (moveDown!=0){
		$('.symbolPop').css('top', maxtop)
	}
	if( moveRight != 0){
		$('.symbolPop').css('left', $('#page-content-wrapper').position().left)
	}
	if (moveLeft!= 0){
		moveRight = moveLeft
		$('.symbolPop').css('left', ($('.symbolPop').position().left - moveLeft))
	}
	change= [moveRight, moveDown]
	map.panBy(change)
}

aaallPointData=null

function popupLineChart(allPointData, popAttr){
	popAttr = ((popAttr==undefined)||(popAttr==null)) ? currentAttribute : popAttr
	aaallPointData = allPointData
	floods= ['2yr','5yr','10yr','25yr','50yr','100yr']
	chartColors= ['#fcc200', '#000080', '#14cad3', '#d1e231']
	scenarios = ['1. Current Precip & Land Use', '2. Future Precip & Land Use', '3. Current Precip with Green Infrastructure', '4. Future Precip with Green Infrastructure']

	var margin = {top: 50, right: 15, bottom: 35, left: 30},
			width= 250 - margin.left - margin.right,
			height = 235 - margin.top - margin.bottom;

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
			.x(function(d) { return x(d['index']); })
			.y(function(d) { return y(d[popAttr]); });

	var straightline = d3.svg.line()
			.x(function(d) { return x(d['index']); })
			.y(function(d) { return y(0); });


		var svg = d3.select(".popupChart").append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.attr('id', allPointData["id"])
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
			.attr('class', 'lineChart');

		scenarioLength = $('[name="scenarioRadios"]').length

		chartData =[]


			svg.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0," + height + ")")
					.call(xAxis)
				.append("text")
					.attr("transform", "translate(0," + margin.bottom + ") rotate(0)")
					.attr("x", width/2)
					.style("text-anchor", "center")
					.attr("class", "axisLabel")
					.text("Flood Event");



			for(i=0;i<scenarioLength;i++){
					scenarioData = []
					scenarioIndexes = setIndexValues(i)
					a = scenarioIndexes.minimumDamageIndex
					b = scenarioIndexes.maximumDamageIndex

					c = 0
					while (a<=b){
						t= (allPointData[a]==0) ? ({BldgDmgPct:0, BldgLossUS:0}) : clone(allPointData[a].attributes)
						t["damageId"]=a
						t["groupId"]=i
						scenarioDater = t
						scenarioDater['index'] = floods[c]
						c++
						a++
						scenarioData.push(scenarioDater)
					}
					chartData.push(scenarioData)
			}

			var lineGroup = svg.selectAll(".lineGroup")
					.data(chartData)
				.enter().append("g")
					.attr("class", "lineGroup")

			lineGroup.append("path")
					.attr("class", "line")
					.attr('d', function(d){return straightline(d)})
					.attr('stroke',function(d,i){return chartColors[i]})
					.attr("stroke-width", "2.5px")
					.attr('stroke-opacity', 1)

			var pointGuides = svg.append("g")
				.attr("class", "pointGuides");
			var circleMarkers = svg.append("g")
				.attr("class", "circleMarkers");

			chartData.forEach(function(group, groupIndex){
				var scenarioGuideGroup= pointGuides
					.append("g")
					.attr("class", "scenario"+(groupIndex+1)+"");
				var xGuides = scenarioGuideGroup.append("g")
					.attr("class", "xGuides");
				var yGuides = scenarioGuideGroup.append("g")
					.attr("class", "yGuides");

				circleMarkers.selectAll(".linecircle")
					.data(group).enter()
					.append("circle")
					.attr("class", function(d){return(d.damageId==damagesCurrent)?"linecircles popCurrent":"linecircles"})
					.attr("id",function(d){return "circleMarker_"+d.damageId+""})
					.attr("cx", function(d){d[groupIndex]=groupIndex;return x(d['index'])})
					.attr("cy", function(d){return height+10})
					.attr("stroke", chartColors[groupIndex])
					.attr("stroke-width",1)
					.attr("fill", function(d){return (d.damageId==damagesCurrent) ? chartColors[groupIndex] : "white"; })
					.attr("r", 0)
					.style("cursor","pointer")
					.on("mouseover",function(d){
						d3.select(this)
							.attr("fill", function(d){return chartColors[d.groupId]})
							.attr("stroke-width","4px")
					})
					.on("mouseout", function(d){
						d3.selectAll('[class="linecircles"]').attr("fill","white")
						.attr("stroke-width",1)
					})
					.on("mousedown", function(d){
						$(".BldgDmgPct_value,.BldgLossUS_value").css("color", function(){
							return chartColors[groupIndex]
						})
					})
					.on("mouseup", function(){
						$(".BldgDmgPct_value,.BldgLossUS_value").css("color","black")
					})
					.on("click", function(d){
						d3.selectAll('.linecircles').classed("popCurrent", false)
						d3.select(this)
							.classed("popCurrent",true)
							.attr("fill",function(d){return chartColors[d.groupId]})
							.attr("stroke-width",1)
						d3.selectAll('[class="linecircles"]').attr("fill","white")

						$(".BldgDmgPct_value").html(formatAttr("BldgDmgPct",d.BldgDmgPct).formattedVal)
						$(".BldgLossUS_value").html(formatAttr("BldgLossUS",d.BldgLossUS).formattedVal)
						$(".popover-content .small-link").removeClass("invisible")
						$('.keyItem text, .tick text').css('font-weight', 'normal')
						$('.keyItem:eq('+groupIndex+') text').css('font-weight', 'bold')
						$('.tick text:contains("'+d.index+'")').css('font-weight', 'bold')
					})


			})
		$(".popover-content .small-link").on("click", function(){
			d3.selectAll('.linecircles').classed("popCurrent", false)
			d3.selectAll('.linecircles').attr("fill","white")
			d3.select("#circleMarker_"+damagesCurrent+"")
				.classed("popCurrent",true)
				.attr("fill",function(d){return chartColors[d.groupId]})
				.attr("stroke-width",1)
			currentData = d3.select("#circleMarker_"+damagesCurrent+"").data()[0]
			$(".BldgDmgPct_value").html(formatAttr("BldgDmgPct",currentData.BldgDmgPct).formattedVal)
			$(".BldgLossUS_value").html(formatAttr("BldgLossUS",currentData.BldgLossUS).formattedVal)
			$(".popover-content .small-link").addClass("invisible")
			$('.keyItem text, .tick text').css('font-weight', 'normal')
			$('.keyItem text').filter(function(d, i){return (d==(parseFloat($('[name="scenarioRadios"]:checked').val())-1))}).css('font-weight', 'bold')
			$('.popupChart .x.axis .tick:eq('+(parseFloat($('[name="floodEventRadios"]:checked').val())-1)+') text').css('font-weight','bold')
		})

		var keyMargin = {top: 0, right: 15, bottom: 10, left: 20}

		var key = d3.select(".popupChart svg")
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + keyMargin.top + ")")
			.attr('class', 'key');

		var keyItem = key.selectAll('.keyItem')
			.data(chartColors)
			.enter().append("g")
			.attr("transform", function(d, i) { return "translate(0," + (i * 11 )+ ")"; })
			.attr('class', 'keyItem');

		keyItem.append('rect')
			.attr("x", -30)
			.attr("y", 2)
			.attr("width", 20)
			.attr("height", 2.5)
			.attr("fill", function(d){return d});


		keyItem.append("text")
			.attr("x", 0)
			.attr("y", 3)
			.attr("dy", ".35em")
			.style("text-anchor","start")
			.style("font-weight",function(d,i){return(i==(parseFloat($('[name="scenarioRadios"]:checked').val())-1))?"bold":"normal"})
			.html(function(d) { return "<i class='fa fa-home'></i>"+ scenarios[chartColors.indexOf(d)];});

	stylePop(popAttr)


	function stylePop(pATTR){
		y.domain([0, d3.max(fullList, function(d){return +d[pATTR]})]);
		d3.selectAll('.popupChart .y.axis').remove()
		svg.append("g")
				.attr("class", "y axis")
				.call(yAxis)
			.append("text")
				.attr("transform", "translate(-"+margin.left+",0) rotate(-90)")
				.attr("y", 8)
				.attr("class", "axisLabel")
				.style("text-anchor", "end")
				.text(function(){return aliases[pATTR]});

		line.y(function(d) {return y(d[pATTR]); });

		var graphline = d3.selectAll('.line')
			.transition().delay(1000)
			.attr('d', function(d){return line(d)})


		d3.selectAll(".linecircles")
			.transition().delay(1000)
			.attr("cx",function(d){return x(d['index'])})
			.attr("cy",function(d){return y(d[pATTR])})
			.attr("r", function(d){return (d.damageId==damagesCurrent) ? 4 : 2.5; });

		$('[name="floodEventRadios"]:checked').val()

		$('.popupChart .x.axis .tick:eq('+(parseFloat($('[name="floodEventRadios"]:checked').val())-1)+')').attr('font-weight','bold')
	}

	$('.fieldToggle').on('click', function(){
		$('.fieldToggle').removeClass('nowShowing')
		$(this).addClass('nowShowing')

		var field = $(this).attr('data')

		stylePop(field)
	})

}
function formatAttr(attr, val){
	function formattDollars (val){
		addFormat= d3.format('$,')

		return addFormat(d3.round(val, 2)*1000)
	}
	function formatPercent(val){

		return ""+String(d3.round(val, 2))+"%"
	}

	newAttr=((attr=="BldgLossUS")&&(attr=="BldgLossUS")) ? "Monetary Damages": "Percent Damage"
	newVal = (attr=="BldgLossUS") ? formattDollars(val) : formatPercent(val)

	returnObj = {attrText: newAttr, formattedVal: newVal}
	return returnObj
}


function destroyPop(){
	$('.symbolPop').popover('destroy')
	d3.select(".popOpen.symbols").attr('class', function(){return 'colorful symbols'})
	d3.select(".popOpen.bars").attr('class', function(){return 'colorful bars'})
}
map.on("viewreset, dragstart", destroyPop)


function popupMaker(data){
  var htmlContent='<button type="button" class="close closePopup" onclick="destroyPop()">x</button>'
  	var data = data;

  	dataToExamine = (data[damagesCurrent]!=0) ? (data[damagesCurrent].attributes) : (data[damagesCompare].attributes)
  	$(dataToExamine).each(function(){
    	entries=this
        for(x in entries){
        	if(x!='OBJECTID'){
				pickData= getCurrent(x);

        		formattedData = formatAttr(x, pickData(data))
        		htmlContent+="<a href='#' class='fieldToggle' id='"+x+"_link' data='"+x+"'>"+formattedData.attrText+"</a> : <span class='"+x+"_value'>"+formattedData.formattedVal+"</span><br>";

        	}
	    }
	    htmlContent+="<span class='pull-right small-link invisible'><a href='#'><i class='fa fa-refresh'></i>&nbsp;&nbsp; Show Current</a></span>"
	})
	htmlContent+='<div id="popupLinks"></div><div style="height:250px; width:250px;"><div class="popupChart"></div></div><div class="arrow">';
	setTimeout(function(){
	  try{
	  	popupLineChart(data)
	  }catch(e){
	  	console.log('lineChartFailed',e)
	  }

	},100)

  return htmlContent;
}

function openPop(id){
	destroyPop()
	delay(function(){
		var popHTML = popupMaker(databyID[id])
			d3.select("#ID_"+id+".symbols").attr('class', function(){return 'colorful symbols popOpen'})
			d3.select("#ID_"+id+".bars").attr('class', function(){return 'colorful bars popOpen'})
		pOptions= {
			container : 'body',
			content : popHTML,
			html : true,
			placement : 'top',
			title: '',
			template: '<div class="popover symbolPop" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>',
			trigger: 'manual'
		}

		$('#ID_'+id+'').popover(pOptions).popover('show')
		$('.symbolPop').css("left", ""+(parseFloat($('.symbolPop').position().left) + parseFloat($('#ID_'+id+'').attr("r")))+"px" )
		$('#'+currentAttribute+'_link').addClass('nowShowing')

		setTimeout(function(){
			keepInView()
		}, 500)
	}, 200)


}

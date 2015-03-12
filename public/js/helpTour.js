var helpData={
	"navbar":{
		selector : ".navbar-brand",
		popOptions: {
			content : "<strong>click</strong> the map title to access help at anytime",
			placement : "bottom",
			title: "Getting Help",
			delay: { "show": 1000, "hide": 0 }
		}
	},
	"toggle":{
		selector : "#menu-toggle",
		popOptions: {
			content : "<i class='fa fa-navicon'></i>&nbsp;&nbsp; the navigation button opens/closes the menu",
			placement : "bottom",
			title: "Opening the Menu",
			delay: { "show": 1000, "hide": 0 }
		},
		before : function(){
			openUp = ($('#sidebar-wrapper').width()==0)?$('#menu-toggle').trigger('click'):null
		}
	},
	"scenario":{
		selector : "#scenario-list",
		popOptions: {
			content : "The report analyzed the affect of different climate / landuse scenarios on flood events in Toledo. Choose any of the scenarios listed in this menu to view that dataset on the map.",
			placement : "bottom",
			title : "Changing the Scenario",
			delay: { "show": 1000, "hide": 0 }
		},
		focusEl: "#scenario-list .list-group-item",
		before : function(){
			return ($("#dataBody").is(":visible")!=true)? $("a[href='#dataBody']").trigger('click') :null
		}
	},
	"attribute":{
		selector : "#attributeBody .list-group",
		popOptions: {
			content : "The flood damages predicted by the report can be measured in either <em>Monetary Losses</em> or <em>Percent Damage</em>, select either from the attribute menu to change the way the map quantifies flood hazards.",
			placement : "bottom",
			title: "Changing the Attribute",
			delay: { "show": 1000, "hide": 0 }
		},
		focusEl: "#attributeBody .list-group-item",
		before : function(){
			return ($("#attributeBody").is(":visible")!=true)? $("a[href='#attributeBody']").trigger('click') :null
		}
	},
	"floodevent":{
		selector : "#floodEventBody .list-group",
		popOptions: {
			content : "The study also assesed multiple flood events. By selecting any of the events listed in this menu you can change the severity of the flood shown on the map.",
			placement : "bottom",
			delay: { "show": 1000, "hide": 0 }
		},
		focusEl : "#floodEventBody .list-group-item",
		before : function(){
			return ($("#floodEventBody").is(":visible")!=true)? $("a[href='#floodEventBody']").trigger('click') :null
		}
	},
	"basemap":{
		selector : "#basemapBody .panel-body",
		popOptions: {
			content : "You can also change the underlying basemap shown on the map by selecting any of the options shown on the basemap menu.",
			placement : (startingValues.mobileDevice==true) ? "bottom" : "left",
			delay: { "show": 1000, "hide": 0 }
		},
		before : function(){
			isVisible = ($("#basemapBody").is(":visible")!=true)? $('a[href="#basemapBody"]').trigger('click') :null
			return $('#sidebar-wrapper').scrollTo("#basemapBody")
		}
	},
	"layer":{
		selector : "#layerBody",
		popOptions: {
			content : "In addition to flood hazards, you can also overlay many other layers on the map by clicking the checkboxes in the layers menu.",
			placement : (startingValues.mobileDevice==true) ? "bottom" : "left",
			delay: { "show": 1000, "hide": 0 }
		},
		before : function(){
			isVisible = ($("#layerBody").is(":visible")!=true)? $('a[href="#layerBody"]').trigger('click') :null
			$('#sidebar-wrapper').scrollTo("#layerBody")
		}
	},
	"share":{
		selector : "#shareBody",
		popOptions: {
			content : "Share the findings displayed on the Toledo Flood Hazard Visualizer with the world!<br>Print or Export your custom map view, or export the data and do your own analysis",
			placement : (startingValues.mobileDevice==true) ? "top" : "left",
			delay: { "show": 1000, "hide": 0 }
		},
		before : function(){
			$('#sidebar-wrapper').scrollTo("#shareBody")
		}
	},
	"map":{
		selector : "#map",
		popOptions: {
			content : "The map displays <strong>Flood Hazard Data</strong> reported by <em>Economic Assessment of Green Infrastructure Strategies for Climate Change Adaptation: Pilot Studies in The Great Lakes Region </em> ",
			placement : "bottom",
			delay: { "show": 1000, "hide": 0 }
		},
		before : function(){

		},
		after: function(){
			var y= $('.tourPop').attr('id')
			$('#'+y+'').css('top','30%')
			$('#'+y+' .arrow').addClass('invisible')
		}
	},
	"legend":{
		selector : "#hazardLegendSVG",
		popOptions: {
			content : "The legend panel explains what the different colors and sizes of the circles mean",
			placement : (startingValues.mobileDevice==true) ? "bottom" : "right",
			delay: { "show": 1000, "hide": 0 }
		},
		focusEl: "#hazardLegendSVG",
		before : function(){
			return ($("#floodHazardsPanel").is(":visible")!=true)? $('a[href="#floodHazardsPanel"]').trigger('click'):null
		}
	},
	"zoom":{
		selector : ".zoomHolder",
		popOptions: {
			content : "The zoom controls allow you to adjust the map scale<ul class='fa-ul'><li><i class='fa fa-plus'></i>&nbsp;&nbsp;Increases the zoom level</li><li><i class='fa fa-minus'></i>&nbsp;&nbsp;Decreases the zoom level</li><li><i class='fa fa-globe'></i>&nbsp;&nbsp;Resets the zoom level</li></ul><small>You can also zoom using your scroll wheel (desktop) or a two-finger pinch (mobile)</small>",
			placement : "left",
			delay: { "show": 1000, "hide": 0 }
		},
		before : function(){
			if ($('#wrapper').hasClass('toggled') && (startingValues.mobileDevice==true)){
				$('#menu-toggle').trigger('click')
			}
		},
		after: function(){
			var y= $('.popover.tourPop').attr('id');
			$('.popover.tourPop #'+y+'').css('top','30%')
			$('#'+y+' .arrow').addClass('invisible')
		}
	},
	"stat":{
		selector : "#statsBody",
		popOptions: {
			content : "The statistics menu displays various measures of the dataset currently shown on the map.",
			placement : (startingValues.mobileDevice==true) ? "top" : "left",
			delay: { "show": 1000, "hide": 0 }
		},
		focusEl: "#statsBody",
		before : function(){
			isVisible = ($("#statsBody").is(":visible")!=true)? $('a[href="#statsBody"]').trigger('click') :null
			return $('#sidebar-wrapper').scrollTo("#statsBody")
		}
	},
	"charts":{
		selector : "#chartsBody",
		popOptions: {
			content : "By selecting any of the options listed in the charts menu you can view and print graphs and diagrams of the data.",
			placement : (startingValues.mobileDevice==true) ? "top" : "left",
			delay: { "show": 1000, "hide": 0 }
		},
		focusEl: "#statsBody",
		before : function(){
			isVisible = ($("#chartsBody").is(":visible")!=true)? $('a[href="#chartsBody"]').trigger('click') :null
			return $('#sidebar-wrapper').scrollTo("#chartsBody")
		}
	},
	"mode":{
		selector : "#modeBody .list-group",
		popOptions: {
			content : "The Toledo Flood Hazard Visualizer allows you to interact with the data in two different ways: <ul><li><strong>Discover</strong>&mdash; allows new users to learn more about the dataset</li><li><strong>Analyze</strong>&mdash; allows experienced users draw conclusions based on the data</li></ul> Select either option from the mode menu to change the Visualizer's settings.",
			placement : "left",
			delay: { "show": 1000, "hide": 0 }
		},
		focusEl: "#modeBody .list-group",
		before : function(){
			$('#sidebar-wrapper').scrollTo("#modeBody .list-group")
		}
	},
	"chart":{
		selector : "#chartsvg",
		popOptions: {
			content : "This chart redisplays the data on the map...",
			placement : "top",
			delay: { "show": 1000, "hide": 0 }
		},
		selector_standin: "#chart",
		before : function(){
			return ($("#chart").is(":visible")!=true)? $('#dataDistributionHeading a').trigger('click'):null
		}

	},
	"classbreak": {
		selector : ".draggable:last",
		popOptions: {
			content : "The classbreaks, &mdash;<small>the points separating the various color categories</small>&mdash; are represented on the chart by the horizontal lines.<br>By dragging them up or down you can define a custom color scale.",
			placement : "top",
			delay: { "show": 1000, "hide": 0 }
		},
		before : function(){
			return ($("#chart").is(":visible")!=true)? $('#dataDistributionHeading a').trigger('click'):null
		},
		after:function(){
			(startingValues.mobileDevice==false) ? $('.tourPop').css("left", ($("#chartsvg").width()/2)) : null
		}
	},
	"bar" : {
		selector : '.colorful.bars[height!=0]:first',
		popOptions: {
			content : "...each bar corresponds with a circle on the map.<br>By clicking on a bar you can zoom to the corresponding circle",
			placement : "top",
			delay: { "show": 1000, "hide": 0 }
		},
		before : function(){
			return ($("#chart").is(":visible")!=true)? $('#dataDistributionHeading a').trigger('click'):null
		}
	},
	"circle" : {
		selector : '.colorful.symbols[r!=0]:first',
		popOptions: {
			content : "Each of the circles on the map represents a land parcel where in which the study predicted that the given flood event would cause damage",
			placement : "top",
			delay: { "show": 1000, "hide": 0 }
		},
		before: function(){
			t= parseInt($('.colorful.symbols[r!=0]:first').attr('id').split('ID_')[1])
			map.setView(databyID[t].LatLng,14)
		},
		after: function(){
			$('.tourPop').css("left", ""+(parseFloat($('.tourPop').position().left) + parseFloat($( '.colorful.symbols[r!=0]:first').attr("r")))+"px" )
		}
	},
	"pop" : {
		selector : '.symbolPop>.arrow',
		popOptions: {
			content : "Click on any circle to view specific information on that parcel.",
			placement : "bottom",
			delay: { "show": 1000, "hide": 0 }
		},
		before: function(){
			openPop(parseInt($('.colorful.symbols[r!=0]:eq(0)').attr('id').split('ID_')[1]))

		},
		after: function(){
			drawBox('.symbolPop')

		}
	},
	"scaleselector" : {
		selector : "#scale-selector-dropdown",
		popOptions: {
			content : "The color scale selector allows you to change the map's classification system &mdash;<small>the categorization method used to determine which data values correspond with which color</small>",
			placement : (startingValues.mobileDevice==true) ? "left" : "right",
			delay: { "show": 1000, "hide": 0 }
		},
		before : function(){
			isVisible = ($("#floodHazardsPanel").is(":visible")!=true)? $('a[href="#floodHazardsPanel"]').trigger('click'):null
		}
	},
	"displayPanel" : {
		selector : "#displayPanel .panel-heading-blue",
		popOptions: {
			content : "The display panel houses controls for modifying the map state",
			placement : "left",
			delay: { "show": 1000, "hide": 0 },
			placement : (startingValues.mobileDevice==true) ? "bottom" : "left",
		},
		before : function(){
			$('#sidebar-wrapper').scrollTo("#displayPanel ")
		}
	},
	"analyzePanel" : {
		selector : "#analyzePanel .panel-heading-blue",
		popOptions: {
			content : "The analyze panel houses tools for investigating the data on the map ",
			delay: { "show": 1000, "hide": 0 },
			placement : (startingValues.mobileDevice==true) ? "top" : "left"


		},
		before : function(){
			$('#sidebar-wrapper').scrollTo("#analyzePanel")
		}
	},
	"dataDistBtn" : {
		selector : "#dataDistributionHeading",
		popOptions: {
			content : "By clicking the data distribution button you can show/hide the data distribution chart.",
			placement : (startingValues.mobileDevice==true) ? "top" : "left",
			delay: { "show": 1000, "hide": 0 }
		},
		before : function(){
			$('#sidebar-wrapper').scrollTo("#dataDistributionHeading")

		}
	},

}

var currentTour = null

	interfaceElements= ["navbar", "toggle"]
	mapElements= ["map","zoom","circle", "pop","legend"]
	dataPanel=["scenario","floodevent","attribute"]
	sideBar=["toggle","layer","basemap","stat", "chart", "bar", "scaleselector", "classbreak", "share"]


var tours = {

		advanced : ["navbar","map","zoom","circle", "pop","legend","scenario","floodevent","attribute","toggle","displayPanel", "layer","basemap", "analyzePanel", "stat","charts", "dataDistBtn", "chart", "bar", "classbreak", "share"]
	}


function nextHelpStep(stepNum){
	$('.popover.tourPop').popover('destroy')
	helpStep(stepNum+1)
}
function lastHelpStep(stepNum){
	$('.popover.tourPop').popover('destroy')
	helpStep(stepNum-1)
}
function skipToStep(stepNum){
	$('.popover.tourPop').popover('destroy')
	helpStep(stepNum)
}
function highlighthide (){
	drawBox('body')
	delay(function(){
		$('.helpHolder').hide()
	}, 800)



}
function endTour(){
	$('.focus').removeClass('focus')
	$('.tourstep-active').removeClass('tourstep-active')
	$('.popover.tourPop').popover('destroy')
	$('.stepElement').remove()
	highlighthide()


	currentTour=null
}
// Inline HTML for  skiping to help tour step
$("[data-toggle='help']").on('click',function(){
	skipToStep((tours['advanced']).indexOf($(this).attr('data-help')))
})


function afterStep(element){
	$('.tourstep-active').parents('.symbolPop').find('.close').trigger('click')
	$('.tourstep-active').removeClass('tourstep-active')
	$('.focus').removeClass('focus')
	$('.tourPop').remove()


}
function drawBox(selector){
	kk = $(selector)[0].getBoundingClientRect()

	d3.select('.above-highlighter')
		.attr('fill', 'black')
		.attr('fill-opacity',0.7)
		.transition().duration(1000)
		.attr('height', kk.top)
		.attr('width', $(document).width())
		.attr('x', 0)
		.attr('y', 0)
	d3.select('.below-highlighter')
		.attr('fill', 'black')
		.attr('fill-opacity',0.7)
		.transition().duration(1000)
		.attr('width', $(document).width())
		.attr('height', $(document).height() - kk.bottom)
		.attr('x', 0)
		.attr('y', function(){ return (kk.top+kk.height)})
	d3.select('.left-highlighter')
		.attr('fill', 'black')
		.attr('fill-opacity',0.7)
		.transition().duration(1000)
		.attr('width', kk.left)
		.attr('height', kk.height)
		.attr('x', 0)
		.attr('y', kk.top)
	d3.select('.right-highlighter')
		.attr('fill', 'black')
		.attr('fill-opacity',0.7)
		.transition().duration(1000)
		.attr('width', $(document).width() -kk.right)
		.attr('height', kk.height)
		.attr('x', kk.width+ kk.left)
		.attr('y', kk.top)
}

function helpStep(stepNum, tour){
	showg = ($('.helpHolder').is(':visible')!=true)? ($('.helpHolder').show()) : null

	// Close Previous Step
	afterStep(stepNum)
	var currentTour = ((tour==null)||(tour==undefined)) ? 'advanced' : tour;
	var focusEl = (helpData[tours[currentTour][stepNum]].focusEl!=undefined) ? helpData[tours[currentTour][stepNum]].focusEl : helpData[tours[currentTour][stepNum]].selector;

	// Define TourPop HTML
	var buttonRight = (stepNum<(tours[currentTour].length-1)) ? "<a href='#' class='btn btn-link pull-right' onclick='nextHelpStep("+stepNum+")' style='font-size:medium'><i class='fa fa-arrow-right'></i></a>" : "",
		buttonLeft = (stepNum>0)?"<a href='#' class='btn btn-link pull-left' onclick='lastHelpStep("+stepNum+")' style='font-size:medium'><i class='fa fa-arrow-left'></i></a>":"",
		buttonRow = "<div class='row'>"+buttonRight+""+buttonLeft+"</div>",
		dismissBtn = "<button type='button' onclick='endTour()' class='close btn-endTour'><span aria-hidden='true'>&times;</span></button><br>";

	// TourPop Index Circles
	var circles = "<div class='row-fluid text-center' id='circle-row'>"
	$(tours[currentTour]).each(function(i){
		var icon = (i!=stepNum) ? 'fa-circle-o' : 'fa-circle';
		circles+="<button onclick='skipToStep("+i+")'class='btn btn-link' style='padding:0px; font-size:xx-small'><i class='fa "+icon+"'></i></button>"
	})
	circles +="</div>";
//circles+='<div><a href="#circle-row" data-toggle="collapse" class="btn btn-link pull-left" style="padding:0px;"><i class="fa fa-bars"></i></a><br>Step'+(stepNum+1)+'</div>';

// Set Options for popup
var x = helpData[tours[currentTour][stepNum]],
	popOptions = {
		html: true,
		container: 'body',
		trigger: 'manual',
		template: '<div class="popover tourPop " role="tooltip"><div class="arrow"></div><div><button type="button" style="padding-right:10px; float:right" onclick="endTour()" class="btn-link btn-endTour"><span aria-hidden="true">&times;</span></button></div><h3 class="popover-title"></h3><div class="popover-content" style="width:280px"></div></div>',
		placement: (x.popOptions.placement != undefined) ? x.popOptions.placement : 'right',
		delay: (x.popOptions.delay != undefined) ? x.popOptions.delay : { "show": 500, "hide": 0 },
		content: (x.popOptions.content != undefined) ? (""+circles+""+x.popOptions.content+" <br>"+buttonRow+"") : (""+circles+"Error; <br>"+buttonRow+"")
	}


	var delayShown = 500;
	function beforeStep(){

		function defaultOpeners(delayShown){

			if (($("#sidebar-wrapper").find(""+x.selector+"").length!=0)&&($("#sidebar-wrapper").width()==0)){
				$('#menu-toggle').trigger('click');
			}

			if(($("#accordion_Data").find(""+x.selector+"").length!=0)&&($('#floodHazardsPanel').height()!=0)&&(startingValues.mobileDevice!=true)){
				$("a[href='#floodHazardsPanel']").trigger('click');
			}
			if(startingValues.mobileDevice==true){
				if(($("#sidebar-wrapper").find(""+x.selector+"").length==0)&&($("#sidebar-wrapper").width()!=0)){
					$('#menu-toggle').trigger('click');
					popOptions["container"] = "body"
					delayShown = (delayShown+500)
				}
			}


			customOpeners(delayShown);

		}
		function customOpeners(delayShown){
			if (x.before!=undefined){
				x.before.call()
				showStep(delayShown)
			}else{
				showStep(delayShown)
			}
		}

		defaultOpeners();

	}
	beforeStep();


	function showStep(delayShown){
		delayShown = popOptions.delay.show
		setTimeout(function(){

			$(x.selector).popover(popOptions)
			$(x.selector).popover('show')
			drawBox(x.selector)
			//setTimeout(drawBox(x.selector),1000)
			var doAfter = (x.after!=undefined) ? x.after.call() : null;

			$(x.selector).addClass('tourstep-active')
			$(x.selector_standin).addClass('tourstep-active')
			$(focusEl).each(function(i,d){
				setTimeout(function(){
					setTimeout(function(){
						$(focusEl).eq(i).removeClass('focus')
					},500);
					$(focusEl).eq(i).addClass('focus')
				}, ((i*500)+400));
			})

		}, delayShown)
	}

}

function helpTour(tour){
	$('.helpHolder').show()
	//tour = ((tour==null)||(tour==undefined)) ? mode : tour
	currentTour='advanced'
	drawBox('body')
	setTimeout(function(){
		helpStep(0)
	}, 600)


}


spotlight = d3.select('.helpHolder')
	.append('svg')
	.attr('width', $(document).width())
	.attr('height', $(document).height());
spotlight.selectAll('highlighters')
	.data(['above','below','left','right'])
	.enter()
	.append('rect')
	.attr('class', function(d){return ''+d+'-highlighter highlighter'})
	.on('click', endTour);



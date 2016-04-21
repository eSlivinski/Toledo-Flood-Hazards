/*
    Created By Lizzi Slivinski, 2014 - 2015
    eSlivinski@gmail.com

    prototypes.js  Document defines prototype functions and other helper functions utilized by the toledo flood hazard visualizer
*/


// GLOBALS
var colors= {
	BldgLossUS : ['#edf8b1','#7fcdbb','#1d91c0','#225ea8','#081c55'],
	BldgDmgPct : ['#ffeda0','#feb24c','#fc4e2a','#e31a1c','#b10026'],
	BldgLossUS_change : ["#e66101","#fdb863","#f7f7f7","#b2abd2","#5e3c99"],
	BldgDmgPct_change : ["#e66101","#fdb863","#f7f7f7","#b2abd2","#5e3c99"]
};


var quantilecolors= {
	BldgLossUS : ['#7fcdbb','#1d91c0','#225ea8','#081c55'],
	BldgDmgPct : ['#feb24c','#fc4e2a','#e31a1c','#b10026'],
	BldgLossUS_change : ["#e66101","#fdb863","#b2abd2","#5e3c99"],
	BldgDmgPct_change : ["#e66101","#fdb863","#b2abd2","#5e3c99"]
};
var jenksColors={
	BldgLossUS : ['#ffffd1','#edf8b1','#7fcdbb','#1d91c0','#225ea8','#081c55'],
	BldgDmgPct : ['#ffffd1','#ffeda0','#feb24c','#fc4e2a','#e31a1c','#b10026'],
	BldgLossUS_change : ["#2166ac", "#67a9cf", "#d1e5f0", "#fddbc7", "#ef8a62", "#b2182b"],
	BldgDmgPct_change : ["#2166ac", "#67a9cf", "#d1e5f0", "#fddbc7", "#ef8a62", "#b2182b"],
}
var aliases = {
	BldgLossUS : "Damages (Thousands of $) ",
	BldgDmgPct : "Percent Damage",
	OBJECTID : "Property ID"
}

pop=null

//Disbatches Scales
function ScaleEm(x, y, z){
	scaleType = (showCompareFeatures==false) ? x : String(x)+'Change'
	attribute = (((y==undefined)||(y==null)) && (showCompareFeatures==false)) ? currentAttribute : (((y==undefined)||(y==null)) && (showCompareFeatures==true)) ? String(currentAttribute)+'_change': y
	scaleName = ((z==undefined)||(z==null)) ? $('#scaleSelector option:selected').val() : z
	population = fullList.map(function(d) { return + d[attribute] ; })//(showCompareFeatures==false)? fullList.map(function(d) { return + d[attribute] ; }) : changeList
	population.sort(d3.ascending)
	pop = population
	var Max = d3.max(fullList, function(d,i){return fullList[i][attribute]})

	var standardDeviation= function(){
		var serie= new geostats(population)
		var classes = serie.getClassStdDeviation(4)
		var scale = d3.scale.threshold()
			.domain(classes)
			.range(jenksColors[attribute]);
			return scale
	}
	var equalInterval= function(){
		var serie= new geostats(population)
		var classes = serie.getClassEqInterval(4)
		var scale = d3.scale.threshold()
			.domain(classes)
			.range(jenksColors[attribute]);
			return scale
	}

	var jenks = function(){

		dom= ss.jenks(population.map(function(d) { return + d ; }), 4)

		var scale = d3.scale.threshold()
			.domain(dom)
			.range(jenksColors[attribute]);
		return scale;
	}


	var custom = function(){
		var serie= new geostats(population)
			equalClasses = serie.getClassEqInterval(4)
			scaleDomain = (customExists[attribute]==undefined) ? equalClasses : customExists[attribute]

		var scale= d3.scale.threshold()
				.domain(scaleDomain)
				.range(jenksColors[attribute])
		return scale;
	}
	var linearHeight = function(){
		var scale = d3.scale.linear()
			.domain([Max, 0])
			.range([1, chartHeight]);
			return scale;
	}

	// var changeLinearHeight= function(){
	// 	var scale = d3.scale.linear()
	// 		.domain(d3.extent(changeList))
	// 		.range([chartHeight, 0]);
	// 		return scale;

	// }
	var thresholdRadius=function(){
		var scale=d3.scale.threshold()
			.domain(ss.jenks(population.map(function(d) { return + d ; }), 4))
			.range([2,5,12,18,29, 40]);
			return scale
	}

	var linearRadius = function(){

		var scale = d3.scale.linear()
			.domain([0, Max])
			.range([0,40]);
			return scale;
	}


	// var changeRadius = function(){

	// 	maxneg = (d3.min(changeList)-1)
	// 	maxpos = (d3.max(changeList)+1)
	// 	biggest= Math.max(Math.abs(maxneg), maxpos)
	// 	var scale = d3.scale.linear()
	// 		.domain([biggest, 0, (biggest*-1)])
	// 		.range([40, 0, 40]);
	// 		return scale;
	// }


	var outScale = ((x=='color') && (scaleName=='jenks')) ? jenks() :
		((x=='color') && (scaleName=='equalInterval')) ? equalInterval() :
		((x=='color') && (scaleName=='stdDev')) ? standardDeviation() :
		((x=='color') && (scaleName=='custom')) ? custom() :
		(scaleType=='height') ? linearHeight() :
		(scaleType=='radius') ? linearRadius() :
		(scaleType=='heightChange') ? changeLinearHeight() :
		(scaleType=='radiusChange') ? changeRadius() : null;

	return outScale
}

// Returns a copy of a javascript object
function clone(obj) {
	if (null == obj || "object" != typeof obj) return obj;
	var copy = obj.constructor();
	for (var attr in obj) {
			if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
	}
	return copy;
}

// Dispatches function for retrieving the current data (d) from allYearData
function getCurrent(x,y){
	x = ((x==null)||(x==undefined)) ? currentAttribute : x

	comp = function(d){
		current = (d[damagesCurrent]!=0)?(d[damagesCurrent].attributes[x]):0
		compare = (d[damagesCompare]!=0)?(d[damagesCompare].attributes[x]):0

		difference = ((current>0)||(compare>0)) ? (compare-current) : 0

		return difference
	}

	cur = function (d){
		return (d[damagesCurrent]!=0) ? d[damagesCurrent].attributes[x]: 0
	}

	return (showCompareFeatures==true) ? comp : cur
}

// Move svg element in front of siblings
d3.selection.prototype.moveToFront = function() {
	return this.each(function(){
		this.parentNode.appendChild(this);
	});
};

// Move svg element behind sibblings
d3.selection.prototype.moveToBack = function() {
	return this.each(function() {
			var firstChild = this.parentNode.firstChild;
			if (firstChild) {
					this.parentNode.insertBefore(this, firstChild);
			}
	});
};

// Scroll to a given DOM Element
$.fn.scrollTo = function( target, options, callback ){
  if(typeof options == 'function' && arguments.length == 2){ callback = options; options = target; }
  var settings = $.extend({
    scrollTarget  : target,
    offsetTop     : 50,
    duration      : 500,
    easing        : 'swing'
  }, options);
  return this.each(function(){
    var scrollPane = $(this);
    var scrollTarget = (typeof settings.scrollTarget == "number") ? settings.scrollTarget : $(settings.scrollTarget);
    var scrollY = (typeof scrollTarget == "number") ? scrollTarget : scrollTarget.offset().top + scrollPane.scrollTop() - parseInt(settings.offsetTop);
    scrollPane.animate({scrollTop : scrollY }, parseInt(settings.duration), settings.easing, function(){
      if (typeof callback == 'function') { callback.call(this); }
    });
  });
}

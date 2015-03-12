
// var changeList=[],
var	customExists = {},
	device=null;


/* FETCHING CURRENT VARIABLES FROM DOM */
function getDamagesIndex(){
	return String(parseInt($('[name="scenarioRadios"]:checked').attr("data-udf")) + parseInt($('input[name="floodEventRadios"]:checked').attr('value')))
}
function getScenarios(){
	var primaryScenario= $('[name="scenarioRadios"]:checked').val()
		comScenario = $('.list-group-item.compare [name="scenarioRadios"]').val()
	return {primaryScenario : primaryScenario, compareScenario : comScenario}
}
function getCompareDamagesIndex(){
	DI = parseInt($('[name="scenarioRadios"]:checked').attr('data-compare-'+$('[name="comparisonRadios"]:checked').val()+''))
	return String(parseInt($('input[name="floodEventRadios"]:checked').attr('value')) + DI)
}


function getDGIndex(){
	return (parseInt($('[name="scenarioRadios"]:checked').attr("data-dg")) + parseInt($('input[name="floodEventRadios"]:checked').attr('value')));
}

function getCurrentAttribute(){
	return $('#fieldSelector option:selected').val();
}

function setIndexValues(x){
	x = (x==undefined)? "checked" : "eq("+x+")"
	baseline = parseInt($("[name='scenarioRadios']:"+x+"").attr("data-udf"))

	damageIndexWidth = parseInt($("[name='scenarioRadios']:"+x+"").attr("data-width")),
	minimumDamageIndex = parseInt($('input[name="floodEventRadios"]:eq(0)').attr('value')) + baseline,
	maximumDamageIndex = (parseInt($('input[name="floodEventRadios"]:eq('+ (damageIndexWidth-1) +')').attr('value'))) + baseline;

	indexValues= {
		damageIndexWidth : damageIndexWidth,
		minimumDamageIndex : minimumDamageIndex,
		maximumDamageIndex : maximumDamageIndex
	}
	return indexValues
}
/*
function getCompareType(){
	return $('[name="comparisonRadios"]:checked').val()
}
function turnOnCompare(){
	$('#scenario-list').addClass('compare-mode')
	$('#toggleCompare i').removeClass('fa-toggle-off').addClass('fa-toggle-on')
	$('#toggleCompare')
		.attr('data-original-title', "Turn Compare View Off")
		.tooltip('fixTitle')
		.tooltip('show');
	return true
}
function turnOffCompare(){
	$('#scenario-list').removeClass('compare-mode')
	$('#toggleCompare i').removeClass('fa-toggle-on').addClass('fa-toggle-off')
	$('#toggleCompare')
		.attr('data-original-title', "Turn Compare View On")
		.tooltip('fixTitle')
		.tooltip('show');
	return false
}

function compareFeaturesState(){
	return ($('#toggleCompare i').hasClass('fa-toggle-on')) ? turnOffCompare():turnOnCompare()
}

$("#toggleCompare").on("click", function(){
	showCompareFeatures = compareFeaturesState()
	handleStyle()
})
*/

$('input[name="fieldRadios"]').on('change', function(){
	currentAttribute = $(this).val()
	handleStyle()
})
$('#fieldSelector').on("change", function(){
	currentAttribute = getCurrentAttribute()
	handleStyle();
})
$("[name='scenarioRadios'], input[name='floodEventRadios']").on("change", function(){
	damagesCurrent = getDamagesIndex(),
	/*damagesCompare = getCompareDamagesIndex()*/
	depthGridCurrent = getDGIndex();

	var indexValues = setIndexValues();

    damageIndexWidth = indexValues.damageIndexWidth,
	minimumDamageIndex = indexValues.minimumDamageIndex,
	maximumDamageIndex = indexValues.maximumDamageIndex;

	handleStyle()

	depth.setLayers([depthGridCurrent])


})
$('input[name="comparisonRadios"]').on('change', function(){
	compareType = getCompareType()
	damagesCompare = getCompareDamagesIndex()
	handleStyle()
})

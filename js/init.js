/*
	Created By Lizzi Slivinski, 2014 - 2015
	eSlivinski@gmail.com

	init.js  Document handles initial styling
*/

// Initialize selectpicker
$('.selectpicker').selectpicker('render')

// Detect what device the site is being viewed in
if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
	 $('.selectpicker').selectpicker('mobile');
	// If mobile--hide print options
	$('.hide-mobile').hide();
}else{
	$('.toolTip').tooltip({ container: '#wrapper'})
}

// Adjust map height
$("#map").css("height", function(){ return ($(window).height() - $('#navHeader').height() )})


// Initialize the document ASAP
$(document).on('ready', function(){
	createSymbols(allYearData);
})
// Once all files are loaded
$(window).on('load', function(){
	// if(serverVariables.publicPath!="/"){
		delay(function(){
			$('[data-target="#aboutModal"]').trigger('click');
		},1500)

	// }
})

// Handle the resize of the document
function resize(){
	$("#map").css("height", function(){ return ($(window).height() - $('#navHeader').height() )})

	map.invalidateSize()

	spotlight
		.attr('width', function(){ return $(document).width();})
		.attr('height', function(){ return $(document).height(); })

	chartResize();
}

// Call the resize function when the document is resized
$(window).on('resize', function(){
	delay(function(){
		resize();
	}, 800)

})


// Add Chrevrons in Side Bar
$('.expandPanel').each(function(){
	iconClass = ($(this).parents('a').attr('aria-expanded')=='true') ? 'fa-chevron-down' : 'fa-chevron-right'
	$(this).append('<i class="fa '+iconClass+' pull-left arrow">')
	$(this).parents('a').on('click', function(){
		$(this).find('.arrow').toggleClass('fa-chevron-right fa-chevron-down')
	})
})
// Data Panel Collapse
$('#accordion_Data .collapse').on('show.bs.collapse', function () {
	$(this).parents('.panel').find('.panel-subtitle').slideUp()
	$(this).parents('.panel').find('.panel-title>i').toggleClass('fa-chevron-right fa-chevron-down')
})
$('#accordion_Data .collapse').on('hide.bs.collapse', function () {
	$(this).parents('.panel').find('.panel-subtitle').slideDown()
	$(this).parents('.panel').find('.panel-title>i').toggleClass('fa-chevron-right fa-chevron-down')
})
$('#accordion_Data input[type="radio"]').on("change", function(){
	$(this).parents('.panel').find('.panel-subtitle').html(""+$(this).parents('label').text()+"")
})

// Radio listGroups
$('.radio.list-group-item label, .radio.list-group').on('click', function(){
	if($(this).parent().is('.active')!=true){
		$(this).parent().addClass('active');
        $(this).parent().siblings().removeClass('active');
	}

})
// Toggling Data Distribution Chart Visibility
$('#dataDistributionHeading a').on('click', function(){
    $(this).find('i').toggleClass('fa-eye fa-eye-slash')
    $('.down-low').toggleClass('down-low-basic down-low-advanced')
})



/* DOM NAMES */
var landUseCheck = $('[name="layerCheckboxes"][data-name="landUse"]'),
    watershedCheck = $('[name="layerCheckboxes"][data-name="watershed"]'),
    stormWaterCheck = $('[name="layerCheckboxes"][data-name="stormDrains"]');

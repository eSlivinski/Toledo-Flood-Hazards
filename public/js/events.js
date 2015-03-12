/* DOM NAMES */
var landUseCheck = $('[name="layerCheckboxes"][data-name="landUse"]'),
    watershedCheck = $('[name="layerCheckboxes"][data-name="watershed"]'),
    stormWaterCheck = $('[name="layerCheckboxes"][data-name="stormDrains"]');

/*EVENTS*/
/* COLOR SCALE OR DISPLAY FIELD CHANGES */
$('#scaleSelector').on('change', function() {
    handleStyle();
})


/*FLOOD EVENT CHANGES*/
$('input[name="floodEventRadios"]').on('change', function() {
    handleStyle()
    depth.setLayers([depthGridCurrent])
});

/*DISPLAY LAYERS CHANGES*/
$('input[name="layerCheckboxes"]').on('change', function() {
    toggleLayers($(this))

});

/*CHANGES TO FEMA SUBLAYER*/
$('input[name="FemaCheckboxes"]').on('change', function() {
       var activeSublayers = $('[name="FemaCheckboxes"]:checked').map(function() { return parseInt($(this).val()) }).get()
       fema.setLayers(activeSublayers);

})
$('input[name="stormWaterCheckboxes"]').on('change', toggleStormWaterSublayers)

$('input[name="landUseRadios"]').on('change', function(){
    return ($(landUseCheck).is(':checked')==true)? handleLandUse():null
})
$('[name="modeRadios"]').on('change', function(){
    // Identify toggle mode state
    mode = $('[name="modeRadios"]:checked').val()
    // Call setMode
    setMode(mode)
    // Trigger alert
    $('#rememberMode-alert').slideDown()
    $('#sidebar-wrapper').scrollTo('#modeBody')
})

$('#forgetMode').on('click', function(){
    removeCookie('mode')
    $('#rememberMode-alert').slideUp()
})
$('#rememberMode').on('click', function(){
    setCookie('mode', 'advanced')
    $('#rememberMode-alert').slideUp()
})
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




// $(window).on('load',resize) //Styles the symbols-->resize calls chartResize-->Calls style


$('.map-printer').on('click', function(){

    $('#printHolder').append('<div id="printMap" style="width: 6.8in;height: 3.5in;"></div>')


   printMap()

})

$('.radio.list-group-item label, .radio.list-group').on('click', function(){
    function makeActive(x){
        $(x).parent().addClass('active')
        $(x).parent().siblings().removeClass('active')
    }

    return isActive = ($(this).parent().is('.active')!=true) ? makeActive(this) : null
})

$('.list-group-check label').on('click', function(e){
    // e=event.preventDefault()
    console.log('check', $(this).parents('.list-group-item'))
    $(this).parents('.list-group-item').find('.fa-check-square-o').hide()
})
















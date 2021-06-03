/*
    Created By Lizzi Slivinski, 2014 - 2015
    eSlivinski@gmail.com

    map.js  Document creates map and leaflet layers, exports printable map and mapview link
*/


// Site Specific Variables
var serviceURL = "http://216.165.135.4:6080/arcgis/rest/services/Toledo_MapServiceFinal/MapServer/";
var siteBounds = L.latLngBounds(sW, nE);
var maxBounds = L.latLngBounds(L.latLng(41.47668911274522, -84.12162780761719), L.latLng(41.96204305667252, -83.00926208496094)),
    fullExtent = L.latLngBounds([41.7055362786694, -83.63419532775879], [41.73378888605136, -83.49686622619629]);

// Map Definition
var map = L.map('map', {
    zoomControl: false,
    maxZoom: 16,
    minZoom: 11,
    maxBounds: maxBounds,
    attributionControl: false,
    trackResize: true
}).fitBounds(siteBounds);


// Basemaps
var satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { 
    name: 'ESRI.WorldImagery', 
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
}),
    toner = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.{ext}', {
        name: 'Stamen.Toner', 
        subdomains: 'abcd', 
        ext: 'png',
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }),
    terrain = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.{ext}', {
        name: 'Stamen.Terrain', 
        subdomains: 'abcd', 
        ext: 'png',
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

// Basemap Feature Group Definition
var basemap = L.featureGroup().addTo(map);

// All possible basemap options
var basemapList = [satellite, toner, terrain];
    // Add curent basemap to map at instantiation
    basemap['currentBaseMap'] = $('[name="basemapRadios"]:checked').val()
    currentBasemap = basemapList[$('[name="basemapRadios"]:checked').val()]
    currentBasemap.addTo(basemap)

// Toggles Current Basemap
function changeBasemap (){
    basemap.clearLayers()
    currentBasemap = basemapList[$('[name="basemapRadios"]:checked').val()]
    basemap['currentBaseMap']= $('[name="basemapRadios"]:checked').val();
    currentBasemap.addTo(basemap)
    stormWater.setZIndex(1)
}
// Basemap radio event listener
$('[name="basemapRadios"]').on('change', changeBasemap)

// ArcGIS Dynamic Layers Brought in through Arc Server REST
var depth = new L.esri.dynamicMapLayer(serviceURL, {
        className: '2',
        layers: [depthGridCurrent],
        opacity:($('[name="layerCheckboxes"]:eq(1)').is(':checked')) ? 1 :0,
        position: "back"
    }).addTo(map);

var fema = L.esri.dynamicMapLayer('http://hazards.fema.gov/gis/nfhl/rest/services/public/NFHL/MapServer', {
        layers: [28, 27, 12, 20],
        className: '3',
        opacity: ($('[name="layerCheckboxes"]:eq(6)').is(':checked')) ? 1 :0,
        position: "back"
    }).addTo(map);

// Changes in FEMA Sublayer
$('input[name="FemaCheckboxes"]').on('change', function() {
       var activeSublayers = $('[name="FemaCheckboxes"]:checked').map(function() { return parseInt($(this).val()) }).get();
       fema.setLayers(activeSublayers);
})

//All possible Overlay Layers--XX=Stand-in to maintain layer indexes
var allLayersList = ['floods', depth, 'stormWater', 'xx','landUse', 'watershed', fema]

// Storm water Layer Group
var stormWater = L.layerGroup().addTo(map);

// Custom Tile Mile Tiles
var stormWaterDitches = L.tileLayer('http://216.165.135.4/asfpm/Tiles/Toledo/StormWaterDitches_/Tiles/{z}/{x}/{y}.png', {
        opacity: (($(stormWaterCheck).is(':checked'))&&($('[name="stormWaterCheckboxes"]:eq(1)')).is(':checked')) ? 1 :0,
        bounds: [[41.4126,-83.8903],[41.7342,-83.1775]],
        val: 'ditches'
    }).addTo(stormWater);

var stormWaterMains = L.tileLayer('http://216.165.135.4/asfpm/Tiles/Toledo/StormWaterMains_/Tiles/{z}/{x}/{y}.png', {
        opacity: (($(stormWaterCheck).is(':checked'))&&($('[name="stormWaterCheckboxes"]:eq(0)').is(':checked'))) ? 1 :0,
        bounds: [[41.5823,-83.7008],[41.7362,-83.4439]],
        val: 'mains'
    }).addTo(stormWater);

// Sets Opacity of all StormWater Sublayers According to parent checkbox value
function toggleStormWater(){
    function turnOff(){ stormWater.eachLayer(function(layer){layer.setOpacity(0)})}
    return ($(stormWaterCheck).is(':checked')) ? toggleStormWaterSublayers() : turnOff()
}
// Sets the Opacity of StormWater Sublayers According to the child checkbox values
function toggleStormWaterSublayers(){
    stormWater.eachLayer(function(layer){ return ($('[value="'+layer.options.val+'"]').is(':checked')) ? layer.setOpacity(1) : layer.setOpacity(0) })
}

$('input[name="stormWaterCheckboxes"]').on('change', toggleStormWaterSublayers)

// Dispatch Layer Display Changes on checkbox toggle
function toggleLayers(checkbox){
    function opacity(){ return ($(checkbox).is(':checked')) ? 0.8 : 0}
    function changeOpacity(){return allLayersList[parseInt($(checkbox).val())].setOpacity(opacity()) }
    identifyLayer = (parseInt($(checkbox).val()) == 0) ? handleStyle() :
        (parseInt($(checkbox).val()) == 2) ? toggleStormWater():
        ((parseInt($(checkbox).val()) == 1) || (parseInt($(checkbox).val()) == 6)) ? changeOpacity() :
        ((parseInt($(checkbox).val()) == 5) && ($('.watershed').length==0))? drawWatershed():
        ((parseInt($(checkbox).val()) == 3)) ? handleLandUse() :null;
    return identifyLayer
}
// Change in Layer checkbox event listener
$('input[name="layerCheckboxes"]').on('change', function() {
    toggleLayers($(this))
});

// Defines HTML for the custom attribution
function attributionText (ouputLocation){
    var outputAttributionText = ""
        outputAttributionText = (ouputLocation=='map') ? outputAttributionText.concat("<a href='http://leafletjs.com/'>Leaflet</a>  <a href='#' onclick='$(\"#fullAttribution\").slideToggle()'><i class='flaticon-info20'></i></a><div id='fullAttribution' style='display: none;'>") : outputAttributionText
        outputAttributionText = outputAttributionText.concat(""+currentBasemap.options.attribution+"")
        outputAttributionText = (depth.options.opacity!=0) ? (outputAttributionText.concat("<br>Depth Grid &mdash; ASFPM Flood Science Center")) : outputAttributionText
        outputAttributionText = (fema.options.opacity!=0) ? (outputAttributionText.concat("<br><a href='http://hazards.fema.gov/gis/nfhl/rest/services/public/NFHL/MapServer'>National Flood Hazard Layer</a> &mdash; FEMA RiskMap CDS")) : outputAttributionText
        outputAttributionText = outputAttributionText.concat("<br>Icons <a href='http://fontawesome.io'>Font Awesome</a> by Dave Gandy")
        outputAttributionText = outputAttributionText.concat("<br>Icons made by Icons8 from <a href='http://www.flaticon.com'>www.flaticon.com</a> is licensed by <a href='http://creativecommons.org/licenses/by/3.0/'>CC BY 3.0</a>")
        outputAttributionText = (ouputLocation=='map') ? outputAttributionText.concat("</div>") : outputAttributionText
    return outputAttributionText;
}
// Sets the Attribution for either the map or the print map base on attributionText()
function applyAttributionText(){
    $('.custom-attribution').html(function(){ return attributionText('map') })
}
// Define the Initial Attribution Text
applyAttributionText()

// Update the attribution Text on layer change
$('[name="basemapRadios"],[name="layerCheckboxes"]').on('change', applyAttributionText)


/* Map Export Functions */

// Print Map
function printMap(){

    // List to hold all the layers that have been added to the print map--length is checked against target legnth
    var loaded = [],
        targetLength = ($('[name="layerCheckboxes"]:checked').length+1);

    // Empty String to be populated with landuse legend if the layer is active
    var legendla = "";

    // Identify the Url of the current basemap
    var tileUrl = basemapList[parseInt(basemap.currentBaseMap)]._url

    // Define Current Basemap
    var BASE = L.tileLayer(tileUrl)
        BASE.on('load', test)

    // Initialize Leaflet Print Map
    var printMap = L.map('printMap', {
            zoomControl: false,
            center: map.getCenter(),
            zoom: map.getZoom(),
            attributionControl:false,
            layers:[BASE]
        });

    // Initailize Svg pane
    printMap._initPathRoot();

    // ADD SVG OVERLAY TO PRINT MAP PANE
    var printMapsvg = d3.select("#printHolder").select("svg"),
        printMapSymbolGroup= printMapsvg.append("g")

    var printTransform = d3.geo.transform({point: projectPoint}),
        printPath = d3.geo.path().projection(printTransform);

    // Project svg points on leaflet map
    function projectPoint(x, y) {
        var point = printMap.latLngToLayerPoint(new L.LatLng(y, x));
            this.stream.point(point.x, point.y);
    };

    // Create depth grid layer on printable map
    DG = function(){
        var DG = L.esri.dynamicMapLayer(serviceURL, {
            className: '2',
            layers: [depthGridCurrent],
            opacity: 1,
            position: "back"
          }).addTo(printMap).on('load', test)

        return DG
    }

    // Create Watershed layer for print map
    WATERSHED= function(){
        function make(topology){
            var watershed = printMapsvg.selectAll(".printwatersheds")
                .data(topojson.feature(topology, topology.objects.watershed).features)
                .enter().append("path")
                .attr("d", printPath)
                .attr("class", "watershed")
                .attr("stroke-width", 5)
                .attr("stroke", "turquoise")
                .attr("fill-opacity", 0)
                .attr("d", printPath)
                .moveToBack()
                .call(test)
        }

        make(silverCreekWatershed_topo)
    }

    // Create FEMA Layer for printable map
    FEMA = function(){
        // Detect which sublayers are checked
        var activeSubs = $('#FEMASublayers input:checked').map(function(){ return parseInt($(this).val())}).get()

        var FEMA = L.esri.dynamicMapLayer('http://hazards.fema.gov/gis/nfhl/rest/services/public/NFHL/MapServer', {
            layers: activeSubs,
            className: '3',
            opacity: 0.8,
            position: "back"
        }).addTo(printMap).on('load', test);

        return FEMA
    }

    // Create landuse layer for printable map
    LANDUSE = function(){

        // Land use scale
        var landUseColors =d3.scale.ordinal()
            .domain(["Commercial", "Green Space", "Industrial", "Institutional Campus", "Other", "Residential"])
            .range(["#838faa", "#00aa00", "#4d4d4d", "#ffaa7f", "#ff8e90", "#fff47b"])

        // Detect which land use is active and the appropriate topology
        var LU_TOPOLOGY = ($('[name=landUseRadios]:checked').val()=="FLU") ? futureLandUse_topo : currentLandUse_topo

        function make(topology){

            var printlandUse = printMapsvg.selectAll(".landUseZones")
                .data(topojson.feature(topology, topology.objects.LU_TYPES).features)
                .enter().append("path")
                .attr("d", printPath)
                .attr("class", "landUseZones")
                .attr("fill", function(d){ return landUseColors(d.properties.Lu_Sum)})
                .attr("fill-opacity", 0.8)
                .moveToBack()
                .call(test);
        }
        make(LU_TOPOLOGY);


        // Copy the already created landuse legend
        legendla="<div class='printLegend'>"+$('[name="landUseRadios"]:checked').parent().text()+"</h4>"+$('#landUsePanel svg').parent().html()+"</div>"
    }

    // Create flood hazards layer for printable map
    SYMBOLS= function(){

        // Define scales and data picking function
        var colorScale= ScaleEm('color'),
            radiScale = ScaleEm('radius')
            pickData = getCurrent()

        var printCircles = printMapSymbolGroup.selectAll('circle')
            .data(allYearData.features)
            .enter().append('circle');

        printCircles.filter(function(d,i){return pickData(d)!=0}).sort().sort(function(a,b){return d3.descending(Math.abs(pickData(a)), Math.abs(pickData(b)))})
            .attr('fill', function(d){return colorScale(pickData(d))})
            .attr('stroke', function(d){return colorScale(pickData(d))})
            .attr('class', 'colorful printSymbols')
            .attr('r', function(d){ return ($('input[name="layerCheckboxes"]:eq(0)').is(':checked')==true) ? (radiScale(pickData(d))*0.7) : 0})
            .attr("cx",function(d) { return printMap.latLngToLayerPoint(d.LatLng).x})
            .attr("cy",function(d) { return printMap.latLngToLayerPoint(d.LatLng).y})
            .call(test);
    }

    // Create stormwater layer for printable map
    STORMWATER= function(){

        // Define stormwater feature group
        var stormWaterNetwork = L.featureGroup();

        // Add the active storm water layers to the storm water feature group
        $('input[name="stormWaterCheckboxes"]:checked').each(function(){
            targetLength ++
            targetLayerURL= ($(this).val()=="mains") ? 'http://216.165.135.4/asfpm/Tiles/Toledo/StormWaterMains/Tiles/{z}/{x}/{y}.png' : 'http://216.165.135.4/asfpm/Tiles/Toledo/StormWaterDitches/Tiles/{z}/{x}/{y}.png'
            targetLayer = L.tileLayer(targetLayerURL).on('load', test);
            stormWaterNetwork.addLayer(targetLayer);
        })

        // Add the storm water network feature layer to the print map
        stormWaterNetwork.addTo(printMap);
        test(stormWaterNetwork);

        return stormWaterNetwork;
    }

    // Lists all possible overlay Layers--XX=Stand-in to maintain layer indexes
    var possibleLayers=[SYMBOLS, DG, STORMWATER, LANDUSE, "xx", WATERSHED, FEMA]

    // For each layer that is checked call the function that adds it to the print map
    var createActiveLayers = $('[name="layerCheckboxes"]:checked').each(function(i,d) {
        x = possibleLayers[parseInt($(this).val())]
        return (typeof x == "function") ? x.call(x) : null
    })

    // Called after each layer is loaded on the print map
    function test(x){

        //Add the loaded layer to the loaded list
        loaded.push(x);

        // If the length of loaded layers is the same as the target length call the execute print function
        return (loaded.length==targetLength) ? execute() : null
    }

    // Add additional elements to the print document and call the print function
    function execute (){

        // Copy the attribution text
        var attrText = $('#fullAttribution').html().replace(/<br>/g, "; ");

        // Create print document elements
        var sourceText = "<small style='font-size: xx-small'>"+attrText+"</small>",
            legend = '<div class="printLegend" style="width:3in"><h4>Flood Hazards</h4>'+$('#baseText').html()+''+$('#hazardLegendSVG').parent().html()+'</div>',
            heading= '<h2>Flood Hazards</h2>',
            la=''+legendla+'',
            legrow= '<br><br><div class="page-break"></div><div><span class="pull-left">'+legend+'</span><span class="pull-right">'+la+'</span></div>';

        // Call print
        $('#printHolder').print({
            stylesheet: ''+serverVariables.publicPath+'css/printing.css',
            append: [sourceText, legrow],
            prepend: heading
        })

        // After print function is called remove the printable map from the dom
        setTimeout(function(){
            $('#printHolder').empty();
        }, 2000)
    }
}
$('.map-printer').on('click', function(){
    $('#printHolder').append('<div id="printMap" style="width: 6.8in;height: 3.5in;"></div>')
   printMap()
})


// Create link with current map view properties encoded
function getLink(obj){
    // Define current map view extent
    var bounds =  map.getBounds(),
        nElat = bounds._northEast.lat,
        nElng= bounds._northEast.lng,
        sWlat= bounds._southWest.lat,
        sWlng= bounds._southWest.lng;

    // Object storing all global variable values to encode in link
    var domExports = {}
        domExports['scenarioSelector'] = $('[name="scenarioRadios"]:checked').parent().parent().index()
        domExports['scaleSelector'] = $('#scaleSelector option:selected').val()
        domExports['layerCheckboxes'] = $('[name="layerCheckboxes"]:checked').map(function(){return parseInt($(this).val()) }).get()
        domExports['sublayers'] = $('.subLayer input:checked').map(function(){return ( isNaN($(this).val()) ) ? ($(this).val()) : (parseInt( $(this).val()) ) }).get()
        domExports['basemapRadios'] = parseInt($('[name="basemapRadios"]:checked').val())
        domExports['fieldSelector'] = $('[name="fieldRadios"]:checked').val()
        domExports['floodEventRadios'] = parseInt($('[name="floodEventRadios"]:checked').val())
        domExports['showCompareFeatures'] = showCompareFeatures
        domExports['sW'] = [sWlat, sWlng]
        domExports['nE'] = [nElat, nElng]
        domExports['mode'] = mode
        domExports['compareType'] = compareType

    var exportString= encodeURIComponent(JSON.stringify(domExports));

    // Place export string in input box
    $(obj).attr('value',function(){
       linkPlace = (window.location.hostname==="localhost") ?  "/":"/toledofloodhazards/"
        return ''+location.origin+''+linkPlace+'mapView/'+exportString+''
    })

    // Show link input div
    $("#mapViewLink").collapse('show')
    var text_val=eval(obj);
        text_val.focus();
        text_val.select();

    // Hide link input div after copied
    $("#mapViewLink input").on('blur',function(){$("#mapViewLink").collapse('hide')})

}

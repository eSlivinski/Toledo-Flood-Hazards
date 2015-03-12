var appData = require('../data/appdata.json')
var MobileDetect = require('mobile-detect')

_DOM = {
	scenarioSelector: 0,
	scaleSelector: 'jenks',
	layerCheckboxes: [0,1],
	sublayers : ["CLU", "mains","ditches", 28, 27, 12, 20],
	basemapRadios: 1,
	fieldSelector: "BldgDmgPct",
	floodEventRadios: 6,
	showCompareFeatures: false,
	sW: [41.7055362786694, -83.63419532775879],
	nE: [41.73378888605136, -83.49686622619629],
	mode: 'advanced',
	compareType: 'landuse'
}



function retrieveGlobals(x){

	var _globals = {}
		_globals['damagesCurrent']			= String(appData.scenarios[x.scenarioSelector].udf + x.floodEventRadios)
		_globals['damagesCompare']			= String(appData.scenarios[x.scenarioSelector]["compare-"+x.compareType] + x.floodEventRadios)
		_globals['depthGridCurrent']		= appData.scenarios[x.scenarioSelector].dg + x.floodEventRadios
		_globals['damageIndexWidth']		= appData.scenarios[x.scenarioSelector].width
		_globals['minimumDamageIndex']		= appData.scenarios[x.scenarioSelector].udf + appData.floods[0].value
		_globals['maximumDamageIndex']		= appData.scenarios[x.scenarioSelector].udf + appData.floods[5].value
		_globals['sW']						= [41.7055362786694, -83.63419532775879]
		_globals['nE']						= [41.73378888605136, -83.49686622619629]
		_globals['mode']					= 'advanced'
	return _globals
}

exports.floodAtlasData = function(req){
	var x = {}
	var md = new MobileDetect(req.headers['user-agent']);
	var isMobile = (md.mobile()==null) ? false : true;
	x['mobileDevice'] = isMobile
	x['theLoc'] =  (req.hostname=='localhost')?"/": "/asfpm/toledo_node/public/"
	x['params'] = req
	return x
}

exports.getData = function(req, queryString){
	var md = new MobileDetect(req.headers['user-agent']);
	var isMobile = (md.mobile()==null) ? false : true;

	var p=(req.hostname=='localhost')?"/":"/asfpm/toledo_node/public/"  //Setting File Locations

		// Rerouting
		d=(req.hostname=='localhost')?"/dataPortal":"/toledofloodhazards/dataPortal"
		a=(req.hostname=='localhost')?"/about":"/toledofloodhazards/about"
	w = {
			dirCurrent: p
		}

	x = (queryString==undefined) ? _DOM : JSON.parse(decodeURIComponent(queryString))
	y = retrieveGlobals(x)

	z = {}

	z['_DOM'] = x
	z['_DOM'].mobileDevice = isMobile
	z['variables'] = y
	z['location'] = w
	z.variables['publicPath'] = p
	z.variables['dataPath'] = d
	z.variables['aboutPath'] = a
	return z
}

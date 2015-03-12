var express = require('express');
var router = express.Router();
var domSettings = require('./domSettings.js')
var fs = require('fs-extra');
var archiver = require('archiver');
var pg = require('pg')
var _ =require('underscore')
var conString = "connectionString";
var floodviewConn = "connectionString";

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS");

  next();
});

// LOAD SPECIFIC MAPVIEW
router.get('/mapView/:title', function(req, res) {
	var queryString = req.params.title
		d = domSettings.getData(req,queryString)

	res.render('index', d);

});

//
router.get('/about', function(req, res) {
		x=domSettings.floodAtlasData(req)
		x['title'] = 'About'

	res.render('about',x)
});
router.get('/map', function(req, res) {
		x= domSettings.floodAtlasData(req)

		x['title'] = 'Map'

	res.render('map',x)
});

router.get('/dataPortal', function(req, res) {
	var client = new pg.Client(conString);
	var x = domSettings.floodAtlasData(req)
	client.connect(function(err) {
	  if(err) {
	    return console.error('could not connect to postgres', err);
	  }else{
	  	 var query = client.query('SELECT * FROM datafiles');
	  	 	query.on('row', function(row,result) { result.addRow(row); });
	  		query.on('end', function(result) {
	  			x['myResult'] = result;
	  			x['desc'] = _.uniq( _.map(result.rows, function(val, key){ return val.name }) )

	  			x['title'] = 'Data Portal'


      		res.render('dataPortal', x)
    	});


	  }

	})

});



// DEFAULT- LOOK FOR MODE COOKIE
router.get('/', function(req, res) {
	d = domSettings.getData(req)

					res.render('index', d)

});

router.get('/:something', function(req, res) {

	var queryString = req.params.something

	res.render('error');
});

module.exports = router;

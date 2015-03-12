var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var routes = require('./routes/index');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));


app.locals.appdata = require('./data/appdata.json');

app.locals.allYearData = require('./data/allYearData.json');
app.locals.dataByYear = require('./data/dataByYear.json');
app.locals.databyID = require('./data/databyID.json');
app.locals.fullList = require('./data/fullList.json');
app.locals.silverCreekWatershed_topo = require('./data/silverCreekWatershed_topo.json');
app.locals.futureLandUse_topo = require('./data/FLU_Reduced.json');
app.locals.currentLandUse_topo = require('./data/CLU_Reduced.json');
console.log(app.get('env'))


app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;

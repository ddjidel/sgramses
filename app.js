
var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var mongo = require('mongodb');
var monk = require('monk');
var dblist = monk('mongodb://heroku:<passwd>@dharma.mongohq.com:10026/app19725356');
// var dblist = monk('127.0.0.1:27017/Ramses');

var app = express();

var dbname = 'mongodb://heroku:<passwd>@dharma.mongohq.com:10026/app19725356';
// var dbname = 'Ramses';
var collections = ['rackData'];
var db = require('mongojs').connect(dbname, collections);

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.get('/racks', function (req, res) { db.rackData.find( {}, function (err, racks) { if (err) { throw error } res.json(racks); }); });
app.get('/rack/:id', function (req, res) { var id = req.params.id; db.rackData.find( { "_id" : id }, function (err, rack) { if (err) { throw err } res.json(rack); }); });
app.post('/racks', function (req, res) { var rack = res.json(req.body); db.rackData.save(rack); });
app.post('/rack/:id/:barcode/:racktype/:status/:timestamp', function (req, res) { var id = req.params.id; var barcode = req.params.barcode; var racktype = req.params.racktype; var status = req.params.status; var timestamp = req.params.timestamp; db.rackData.save( { _id: id, barcode: barcode, racktype: racktype, status: status, timestamp: timestamp }); });

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/racklist', routes.racklist(dblist));

http.createServer(app).listen(app.get('port'), function(){ console.log('Express server listening on port ' + app.get('port') + ' Mongo Database: ' + dbname); });

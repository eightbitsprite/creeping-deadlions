
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars');
var Handlebars = require('handlebars');
//var bodyParser = require('body-parser');
var Parse = require('parse').Parse;
var index = require('./routes/index');
var login = require('./routes/login');
var cutscene = require('./routes/cutscene');
var village = require('./routes/village');
var mission_form = require('./routes/mission_form');
var mission_altform = require('./routes/mission_altform');
var _ = require('underscore');
// Example route
// var user = require('./routes/user');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('Intro HCI secret key'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Add routes here
app.get('/', index.view);
app.get('/vInfo', index.data);
app.get('/login', login.view);
app.get('/create_mission', mission_form.view);
app.get('/create_missiion', mission_altform.view);
app.get('/new_mission', cutscene.new);
app.get('/village', village.view);
app.get('/mission_complete', cutscene.complete);
app.get('/mission_fail', cutscene.fail);
//app.get('/project/:name', project.viewProject);

// Example route
// app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var mongoStore = require('connect-mongo')(session);
var morgan = require('morgan');
var port = process.env.port || 3000;
var dbUrl = 'mongodb://localhost/imooc';

var app = express();

mongoose.connect(dbUrl);
app.set('views', path.join(__dirname, 'app/views/pages'));
app.set('view engine', 'pug');

app.locals.moment = require('moment');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extend: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
	secret: 'imooc',
	store: new mongoStore({
		url: dbUrl,
		collection: 'sessions'
	}),
	resave: false,
	saveUninitialized: true
}));
if(app.get('env') === 'development') {
	app.set('showStackError', true);
	app.use(morgan(':method:url:status'));
	app.locals.pretty = true;
	mongoose.set('debug', true);
}
require('./config/routes')(app);
app.listen(port);

console.log('app is running on port ' + port);

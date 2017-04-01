var express = require('express');
var path = require('path');
var port = process.env.port || 3000;

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port);
console.log('app is running on port ' + port);

// index page
app.get('/', function(req, res) {
	res.render('index', {
		title: 'imooc 首页'
	});
})

// list page
app.get('/admin/list', function(req, res) {
	res.render('list', {
		title: 'imooc 列表页'
	});
})

// detail page
app.get('/movie/:id', function(req, res) {
	res.render('detail', {
		title: 'imooc 详情页'
	});
})

// admin page
app.get('/admin/movie', function(req, res) {
	res.render('admin', {
		title: 'imooc 后台录入页'
	});
})
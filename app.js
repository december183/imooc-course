var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');
var _ = require('underscore');
var Movie = require('./models/movie');
var port = process.env.port || 3000;

var app = express();

mongoose.connect('mongodb://localhost/imooc');
app.set('views', path.join(__dirname, 'views/pages'));
app.set('view engine', 'pug');

app.locals.moment = require('moment');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extend: false }));
app.use(bodyParser.json());
app.listen(port);

console.log('app is running on port ' + port);

// index page
app.get('/', function(req, res) {
	Movie.fetch(function(err, movies) {
		if(err) {
			console.log(err);
		}
		res.render('index', {
			title: 'imooc 电影网站首页',
			movies: movies
		});
	});
})

// list page
app.get('/admin/list', function(req, res) {
	Movie.fetch(function(err, movies) {
		if(err) {
			console.log(err);
		}
		res.render('list', {
			title: 'imooc 列表页',
			movies: movies
		});
	});
})

// detail page
app.get('/movie/:id', function(req, res) {
	var id = req.params.id;
	Movie.findById(id, function(err, movie) {
		if(err) {
			console.log(err);
		} else {
			res.render('detail', {
				title: 'imooc ' + movie.title,
				movie: movie
			});
		}
	});
	
})

// admin page
app.get('/admin/movie', function(req, res) {
	res.render('admin', {
		title: 'imooc 后台录入页',
		movie: {
			title: '',
			doctor: '',
			country: '',
			year: '',
			language: '',
			poster: '',
			flash: '',
			summary: ''
		}
	});
})

// admin update movie
app.get('/admin/update/:id', function(req, res) {
	var id = req.params.id;
	if(id) {
		Movie.findById(id, function(err, movie) {
			if(err) {
				console.log(err);
			} else {
				res.render('admin', {
					title: 'imooc 后台更新页',
					movie: movie
				});
			}
		});
	}
})

// admin post movie
app.post('/admin/movie/new', function(req, res) {
	var id = req.body.movie._id;
	var movieObj = req.body.movie;
	// console.log(id);
	// console.log(movieObj);
	if(id != '') {
		Movie.findById(id, function(err, movie) {
			if(err) {
				console.log(err);
			} else {
				_movie = _.extend(movie, movieObj);
				_movie.save(function(err, movie) {
					if(err) {
						console.log(err);
					}
					res.redirect('/movie/' + movie._id);
				});
			}
		});
	} else {
		_movie = new Movie({
			doctor: movieObj.doctor,
			title: movieObj.title,
			country: movieObj.country,
			language: movieObj.language,
			year: movieObj.year,
			poster: movieObj.poster,
			summary: movieObj.summary,
			flash: movieObj.flash
		});
		_movie.save(function(err, movie) {
			if(err) {
				console.log(err);
			}
			res.redirect('/movie/' + movie._id);
		});
	}
});
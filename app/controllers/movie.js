var Movie = require('../models/movie');
var Comment = require('../models/comment');
var _ = require('underscore');

// list movie page
exports.list = function(req, res) {
	Movie.fetch(function(err, movies) {
		if(err) {
			console.log(err);
		}
		res.render('list', {
			title: 'imooc 列表页',
			movies: movies
		});
	});
}

// delete movie
exports.del = function(req, res) {
	var id = req.query.id;

	if(id) {
		Movie.remove({_id: id}, function(err, movie) {
			if(err) {
				console.log(err);
			} else {
				res.json({success: 1});
			}
		});
	}
}

// detail movie page
exports.detail = function(req, res) {
	var id = req.params.id;
	Movie.findById(id, function(err, movie) {
		if(err) {
			console.log(err);
		} else {
			Comment.find({movie: id})
			.populate('from', 'name')
			.populate('reply.from reply.to', 'name')
<<<<<<< HEAD
			.exec(function(err, comments) {
				res.render('detail', {
					title: 'imooc ' + movie.title,
					movie: movie,
					comments: comments
				});
			})
=======
			.exec(function(err, comments){
				if(err) {
					console.log(err);
				} else{
					res.render('detail', {
						title: 'imooc ' + movie.title,
						movie: movie,
						comments: comments
					});
				}
			});
>>>>>>> 32d8403c57fbfb38cf4dc1b55ee87c348e5d4ca4
		}
	});
}

// admin new movie page
exports.new = function(req, res) {
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
}

// admin update movie page
exports.update = function(req, res) {
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
}

// admin save movie
exports.save = function(req, res) {
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
}
var Movie = require('../models/movie');
var Comment = require('../models/comment');
var Category = require('../models/category');
var _ = require('underscore');

// list movie page
exports.list = function(req, res) {
	Movie.find({})
	.populate('category', 'name')
	.exec(function(err, movies) {
		if(err) {
			console.log(err);
		}
		res.render('list', {
			title: 'imooc 列表页',
			movies: movies
		});
	})
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
	Movie.update({_id: id}, {$inc: {pv: 1}}, function(err) {
		if(err) {
			console.log(err);
		}
	});
	Movie.findById(id, function(err, movie) {
		if(err) {
			console.log(err);
		} else {
			Comment.find({movie: id})
			.populate('from', 'name')
			.populate('reply.from reply.to', 'name')
			.exec(function(err, comments) {
				res.render('detail', {
					title: 'imooc ' + movie.title,
					movie: movie,
					comments: comments
				});
			})
		}
	});
	
}

// admin new movie page
exports.new = function(req, res) {
	Category.find({}, function(err, categories) {
		res.render('admin', {
			title: 'imooc 后台录入页',
			movie: {},
			categories: categories
		});
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
				Category.find({}, function(err, categories) {
					res.render('admin', {
						title: 'imooc 后台更新页',
						movie: movie,
						categories: categories
					});
				});
			}
		});
	}
}

// admin save movie
exports.save = function(req, res) {
	var id = req.body.movie._id;
	var movieObj = req.body.movie;
	var posterData = req.file;
	// console.log(posterData);
	if(posterData) {
		movieObj.poster = posterData.path.substr(6);
	}
	var _movie;
	if(id) {
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
		var categoryId = movieObj.category;
		var categoryName = movieObj.categoryName;
		if(categoryId == '') {
			delete movieObj.category;
		}
		_movie = new Movie(movieObj);
		// console.log(movieObj);
		_movie.save(function(err, movie) {
			if(err) {
				console.log(err);
			}
			if(categoryId) {
				Category.findById(categoryId, function(err, category) {
					category.movies.push(movie._id);
					category.save(function(err, category) {
						res.redirect('/movie/' + movie._id);
					})
				})
			} else if(categoryName) {
				var category = new Category({
					name: categoryName,
					movies: [movie._id]
				});
				category.save(function(err, category) {
					movie.category = category._id;
					movie.save(function(err, movie) {
						res.redirect('/movie/' + movie._id);
					});
				});
			}
		});
	}
}
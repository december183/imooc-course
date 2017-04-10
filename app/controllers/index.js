var Movie = require('../models/movie');
var Category = require('../models/category');

exports.index = function(req, res) {
	Category.find({})
	.populate({
		path: 'movies',
		select: 'title poster',
		options: {limit: 6}
	})
	.exec(function(err, categories) {
		if(err) {
			console.log(err);
		}
		// console.log(categories);
		res.render('index', {
			title: 'imooc 电影网站首页',
			categories: categories
		});
	});
}

exports.search = function(req, res) {
	var catId = req.query.cat;
	var page = parseInt(req.query.p, 10) || 1;
	var count = 2;
	var index = (page-1)*count;
	Category.find({_id: catId})
	.populate({
		path: 'movies',
		select: 'title poster'
	})
	.exec(function(err, categories) {
		if(err) {
			console.log(err);
		}
		console.log(categories);
		var category = categories[0] || {};
		var movies = category.movies || {};
		var result = movies.slice(index, index + count);
		res.render('result', {
			title: 'imooc 结果列表页',
			keyword: category.name,
			currentPage: page,
			totalPage: Math.ceil(movies.length / count),
			movies: result,
			query: 'cat=' + catId
		})
	})
}
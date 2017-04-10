var Category = require('../models/category');

// list category page
exports.list = function(req, res) {
	Category.fetch(function(err, categories) {
		if(err) {
			console.log(err);
		}
		res.render('categorylist', {
			title: 'imooc 分类列表页',
			categories: categories
		});
	});
}

// admin new category page
exports.new = function(req, res) {
	res.render('category_admin', {
		title: 'imooc 后台分类录入页',
		category: {}
	});
}

// admin save category
exports.save = function(req, res) {
	_category = req.body.category;
	var category = new Category(_category);

	category.save(function(err, category) {
		if(err) {
			console.log(err);
		}
		res.redirect('/admin/category/list');
	})
}
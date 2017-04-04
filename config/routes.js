var _ = require('underscore');
var Movie = require('../models/movie');
var User = require('../models/user');

module.exports = function(app) {
	// index page
	app.get('/', function(req, res) {
		// var user = req.session.user;
		// console.log(user);

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

	// list delete page
	app.delete('/admin/list', function(req, res) {
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
	app.get('/admin/new', function(req, res) {
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

	// signup page
	app.post('/user/signup', function(req, res) {
		var _user = req.body.user;
		var checkPass = req.body.checkPass;
		// console.log(_user);	
		// console.log(checkPass);
		if(_user.password != checkPass) {
			console.log('密码与密码确认不一致');
			return res.redirect('/');
		} else {
			User.find({name: _user.name}, function(err, user) {
				if(err) {
					console.log(err);
				} 
				// console.log(user);
				if(user.length > 0) {
					return res.redirect('/');
				} else {
					var user = new User(_user);
					user.save(_user, function(err, user) {
						if(err) {
							console.log(err);
						}
						res.redirect('/admin/userlist');
					});	
				}
			});
		}
	})

	// singin page
	app.post('/user/signin', function(req, res) {
		var _user = req.body.user;
		var name = _user.name;
		var password = _user.password;
		User.findOne({name: name}, function(err, user) {
			if(err) {
				console.log(err);
			}
			if(!user) {
				console.log('不存在此用户');
				return res.redirect('/');
			}
			user.comparePassword(password, function(err, isMatch) {
				if(err) {
					console.log(err);
				}
				if(isMatch) {
					req.session.user = user;
					return res.redirect('/');
				} else {
					console.log('password is no matched');
					return res.redirect('/');
				}
			})
		})
	})

	// logout page
	app.get('/logout', function(req, res) {
		delete req.session.user;
		delete app.locals.user;
		res.redirect('/');
	})

	// userlist page
	app.get('/admin/userlist', function(err, res) {
		User.fetch(function(err, users) {
			if(err) {
				console.log(err);
			}
			res.render('userlist', {
				title: 'imooc 用户列表页',
				users: users
			});
		});
	})
}


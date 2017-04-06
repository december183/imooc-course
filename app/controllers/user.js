var User = require('../models/user');

exports.signup = function(req, res) {
	res.render('signup', {
		title: '用户注册'
	});
}

exports.userSignup = function(req, res) {
	var _user = req.body.user;
	var checkPass = req.body.checkPass;
	if(_user.password != checkPass) {
		console.log('密码与密码确认不一致');
		return res.redirect('/signup');
	} else {
		User.find({name: _user.name}, function(err, user) {
			if(err) {
				console.log(err);
			} 
			// console.log(user);
			if(user.length > 0) {
				console.log('该用户名已存在');
				return res.redirect('/signin');
			} else {
				var user = new User(_user);
				user.save(_user, function(err, user) {
					if(err) {
						console.log(err);
					}
					res.redirect('/admin/user/list');
				});	
			}
		});
	}
}

exports.signin = function(req, res) {
	res.render('signin', {
		title: '用户登录'
	});
}

exports.userSignin = function(req, res) {
	var _user = req.body.user;
	var name = _user.name;
	var password = _user.password;
	User.findOne({name: name}, function(err, user) {
		if(err) {
			console.log(err);
		}
		if(!user) {
			console.log('不存在此用户');
			return res.redirect('/signup');
		}
		user.comparePassword(password, function(err, isMatch) {
			if(err) {
				console.log(err);
			}
			if(isMatch) {
				req.session.user = user;
				return res.redirect('/');
			} else {
				console.log('密码错误，请重新登录');
				return res.redirect('/signin');
			}
		})
	})
}

exports.logout = function(req, res) {
	delete req.session.user;
	res.redirect('/');
}

exports.list = function(err, res) {
	User.fetch(function(err, users) {
		if(err) {
			console.log(err);
		}
		res.render('userlist', {
			title: 'imooc 用户列表页',
			users: users
		});
	});
}

exports.loginRequired = function(req, res, next) {
	var user = req.session.user;
	if(!user) {
		console.log('请先登录');
		return res.redirect('/signin');
	}

	next();
}

exports.adminRequired = function(req, res, next) {
	var user = req.session.user;
	if(user.role < 10) {
		console.log('权限不足');
		return res.redirect('/');
	}

	next();
}
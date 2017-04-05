var User = require('../models/user');

exports.signup = function(req, res) {
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
}

exports.signin = function(req, res) {
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
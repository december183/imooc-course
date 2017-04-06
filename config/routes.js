var Index = require('../app/controllers/index');
var Movie = require('../app/controllers/movie');
var User = require('../app/controllers/user');

module.exports = function(app) {

	// pre
	app.use(function(req, res, next) {
		var _user = req.session.user;
		app.locals.user = _user;

		next();
	});

	// Index
	app.get('/', Index.index);

	// Movie
	app.get('/admin/movie/list', User.loginRequired, User.adminRequired, Movie.list);
	app.delete('/admin/movie/list', User.loginRequired, User.adminRequired, Movie.del);
	app.get('/movie/:id', Movie.detail);
	app.get('/admin/movie/new', User.loginRequired, User.adminRequired, Movie.new);
	app.get('/admin/movie/update/:id', User.loginRequired, User.adminRequired, Movie.update);
	app.post('/admin/movie/save', User.loginRequired, User.adminRequired, Movie.save);

	// User
	app.get('/signup', User.signup);
	app.post('/user/signup', User.userSignup);
	app.get('/signin', User.signin);
	app.post('/user/signin', User.userSignin);
	app.get('/logout', User.logout);
	app.get('/admin/user/list', User.loginRequired, User.adminRequired, User.list);
}


var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
	name: {
		unique: true,
		type: String
	},
	password: {
		unique: true,
		type: String
	},
	meta: {
		createAt: {
			type: Date,
			default: Date.now()
		},
		updateAt: {
			type: Date,
			default: Date.now()
		}
	}
});

UserSchema.pre('save', function(next) {
	var user = this;
	if(this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	} else {
		this.meta.updateAt = Date.now();
	}
	bcrypt.genSalt(10, function(err, salt) {
		if(err) next(err);

		bcrypt.hash(user.password, salt, function(err, hash) {
			if(err) next(err);

			user.password = hash;
			next();
		})
	})
	// next();
});

UserSchema.statics = {
	fetch: function(cb) {
		return this
		.find({})
		.sort('meta.updateAt')
		.exec(cb);
	},
	findById: function(id, cb) {
		return this
		.findOne({_id: id})
		.exec(cb);
	}
}

module.exports = UserSchema;
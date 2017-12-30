const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');

const storySchema = new mongoose.Schema({
	_storyId: mongoose.Schema.Types.ObjectId,
	slug: String,
	description: {
		type: String,
		trim: true
	},
	created: Date,
	author: {
		type: String,
		trim: true,
		required: 'Please enter'
	},
	gender: [String]
});

storySchema.pre('save', function(next){
	if(!this.isModified('')){
		next(); //skip it
		return; //stop function from running
	}
	this.created = Date.now();
	this._storyId = new mongoose.Types.ObjectId();
	this.slug = slug(this.author);
	next();
	// TODO: make more resilient so slugs are unique
});

module.exports = mongoose.model('Story', storySchema);

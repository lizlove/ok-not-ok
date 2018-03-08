const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');

const storySchema = new mongoose.Schema({
	description: {
		type: String,
		trim: true,
		required: 'Please enter'
	},
	slug: String,
	created: {
		type: Date,
		default: Date.now
	},
	name: {
		type: String,
		trim: true
	},
	gender: [String]
});

storySchema.pre('save', function(next){
	if(!this.isModified('')){
		next(); //skip it
		return; //stop function from running
	}
	this.created = Date.now();
	this.slug = slug(this._id.toString());
	next();
});

module.exports = mongoose.model('Story', storySchema);

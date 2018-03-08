const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');

const storySchema = new mongoose.Schema({
	description: {
		type: String,
		trim: true,
		required: 'Please enter a story'
	},
	slug: String,
	created: {
		type: Date,
		default: Date.now
	},
	author: {
		type: String,
		trim: true,
		required: 'Please provide an author name'
	},
	gender: [String]
});

storySchema.pre('save', async function(next) {
	if(!this.isModified('')){
		next(); //skip it
		return; //stop function from running
	}
	this.created = Date.now();
	this.slug = slug(this.author);
	// find other stores that have a slug of wes, wes-1, wes-2
	const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
	const storesWithSlug = await this.constructor.find({ slug: slugRegEx });
	if (storesWithSlug.length) {
		this.slug = `${this.slug}-${storesWithSlug.length + 1}`;
	}
	next();
});

module.exports = mongoose.model('Story', storySchema);

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
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: 'Please provide an author name'
	},
	gender: {
		type: Number,
		min: 0,
		max: 2
	}
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});
// Gender Schema
// 0 = Female
// 1 = Male
// 2 = Other

storySchema.pre('save', async function(next) {
	if(!this.isModified('')){
		next(); //skip it
		return; //stop function from running
	}
	this.created = Date.now();
	this.slug = slug(this.author);
	// find other stores that have a slug of wes, wes-1, wes-2
	const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
	const storiesWithSlug = await this.constructor.find({ slug: slugRegEx });
	if (storiesWithSlug.length) {
		this.slug = `${this.slug}-${storiesWithSlug.length + 1}`;
	}
	next();
});

storySchema.statics.getTopStories = function(){
	return this.aggregate([
		// Lookup stories and populate their reviews
		{ $lookup: { from: 'ratings', localField: '_id', foreignField: 'story', as: 'ratings' }},
		// Filter for only items that have 2 or more reviews
		{ $match: { 'ratings.1': { $exists: true } }},
		// Add the percent ok field
		{ $project: {
			percentOk: { $avg: '$ratings.rating' }
		}}
		// Sort it by our new field, highest reviews first
		// Limit to at most 10
	]);
}

// find ratings where the story _id property === rating story property
storySchema.virtual('ratings', {
  ref: 'Rating', // what model to link?
  localField: '_id', // which field on the story?
  foreignField: 'story' // which field on the review?
});

module.exports = mongoose.model('Story', storySchema);

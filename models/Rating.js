const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const ratingSchema = new mongoose.Schema({
	created: {
		type: Date,
		default: Date.now()
	},
	author: {
		type: String,
		ref: 'Session'
	},
	story: {
		type: mongoose.Schema.ObjectId,
		ref: 'Story',
		required: 'You must have a story to rate.'
	},
	rating: {
		type: Boolean,
		required: 'You must rate the story as ok or not ok.'
	},
	gender: {
		type: Number,
		min: 0,
		max: 2
	}
});

// TODO: Add gender to session schema.
// Gender Schema
// 0 = Female
// 1 = Male
// 2 = Other

module.exports = mongoose.model('Rating', ratingSchema);

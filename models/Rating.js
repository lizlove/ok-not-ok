const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const ratingSchema = new mongoose.Schema({
	created: {
		type: Date,
		default: Date.now()
	}
	// story: {
	// 	type: mongoose.schema.ObjectId,
	// 	ref: 'Story',
	// 	required: 'You must have a story to rate.'
	// },
	// isOk: {
	// 	type: boolean,
	// 	default: true,
	// 	required: 'You must rate the story.'
	// },
	// gender: {
	// 	type: string,
	// 	default: 'other'
	// }
});

module.exports = mongoose.model('Rating', ratingSchema);

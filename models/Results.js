true = ok
false = not ok

// TODO: how do I link to the Object ID for the story?
const resultsSchema = new mongoose.Schema({
	_resultId: mongoose.Schema.Types.ObjectId,
	countAll: Number,
	ok: {
		totalOk: Number
		female: Number
		male: Number
		other: Number
	},
	notOk: {
		totalNotOk: Number,
		female: Number
		male: Number
		other: Number
	}
});

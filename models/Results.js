true = ok
false = not ok

const resultsSchema = new mongoose.Schema({
	count: Number,
	ok: {
		countOk: Number
		female: Number
		male: Number
		other: Number
	},
	notOk: {
		countNotOk: Number,
		female: Number
		male: Number
		other: Number
	}
});
const mongoose = require('mongoose');
const Story = mongoose.model('Story'); //Singleton from mongoose

exports.homePage = (req, res) => {
	res.render('index');
};

exports.getAbout = async (req, res) => {
	res.render('about', { title: 'About' });
};

exports.addStory = (req, res) => {
	res.render('editStory', { title: 'Add Story' }); //use same template for add and edit story
};

exports.createStory = async (req, res) => {
	const story = await new Story(req.body).save(); //req.body adheres to the schema
	req.flash('success', `Successfully Created the Story, ${capitalizeFirstLetter(story.slug)}.`);
	res.redirect(`/story/${story.slug}`);
};

exports.getStories = async (req, res) => {
	let page = req.params.page || 1;
	const limit = 1;
	const skip = (page * limit) - limit;
	const storiesPromise = Story
		.find()
		.populate('ratings')
		.skip(skip)
		.limit(limit);

	const countPromise = Story.count();
	const [stories, count] = await Promise.all([storiesPromise, countPromise]);
	if (page > count) {
		res.redirect(`/stories/page/1`);
	} else {
		res.render('stories', { title: 'Stories', stories, page, count });
	}
};

exports.getStoryBySlug = async (req, res, next) => {
	const story = await Story.findOne({ slug: req.params.slug }).populate('author ratings');
	if (!story) {
		return next();
	}
	res.render('story', { story, title: "" });
};

exports.editStory = async (req, res) => {
	// find the store given the id
	const story = await Story.findOne({ _id: req.params.id });
	// render out the edit form so the user can update their store
	res.render('editStory', { title: `Edit the Story, ${capitalizeFirstLetter(story.slug)}`, story });
};

exports.updateStory = async (req, res) => {
	const story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
		new: true, // return the new store instead of the old one
		runValidators: true
	}).exec();
	req.flash('success', `Successfully updated <strong>${story.slug}</strong>. <a href="/story/${story.slug}">View story →</a>`);
	res.redirect(`/stories/${story._id}/edit`);
};

exports.getTopResults = async (req, res) => {
	const results = await Story.getTopResults();
	res.render('results', { results, title: '⭐ Results!' });
};

exports.updateRatingStats = async (req, res) => {
	const [story] = await Story.updateRatingStats(req.body.story);
	const updated = await Story.findOneAndUpdate({ _id: req.params.id }, story, {
		new: true, // return the new store instead of the old one
		runValidators: true
	}).exec();
	let ref = req.get('Referrer');
	let page = ref.substr(ref.lastIndexOf('/') + 1);
	page = page === 'stories' ? 1 : parseInt(page) + 1;
	res.redirect(`/stories/page/${page}`);
}

exports.deleteStory = async (req, res) => {
	const story = await Story.findOne({ _id: req.params.id });
	req.sanitizeBody('agreement');
	req.checkBody('agreement', 'You must acknowledge this is irreversible!').equals('on');
	const errors = req.validationErrors();
	if (errors) {
	  req.flash('error', errors.map(err => err.msg));
	  res.render('editStory', { title: `Edit the Story, ${capitalizeFirstLetter(story.slug)}`, story, flashes: req.flash() });
	  return; // stop the fn from running
	}
	const deleted = await Story.findByIdAndDelete(story._id);
	req.flash('info', `Successfully deleted <strong>${story.slug}</strong>. 🚮`);
	res.redirect(`/stories`);
}

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}
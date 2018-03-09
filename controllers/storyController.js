const mongoose = require('mongoose');
const Story = mongoose.model('Story'); //Singleton from mongoose


exports.homePage = (req, res) => {
	res.render('index');
};

exports.addStory = (req, res) => {
	res.render('editStory', {title: 'Add Story'}); //use same template for add and edit store
};

exports.createStory = async (req, res) => {
	const story = await new Story(req.body).save(); //req.body adheres to the schema
	req.flash('success', `Successfully Created ${story.name}. Care to leave a review?`);
	res.redirect(`/story/${story.slug}`);
};

exports.getStories = async (req, res) => {
<<<<<<< HEAD
	// 1. Query the database for a list of all the stories
	const stories = await Story.find();
	res.render('stories', { title: 'Stories', stories});
}
=======
	const page = req.params.page || 1;
	const limit = 1;
	const skip = (page * limit) - limit;
	const storiesPromise = Story
		.find()
		.skip(skip)
		.limit(limit);

	const countPromise = Story.count();
	const [stories, count] = await Promise.all([storiesPromise, countPromise]);

	res.render('stories', { title: 'Stories', stories, page, count});
};

exports.getStoryBySlug = async (req, res, next) => {
	const story = await Story.findOne({ slug: req.params.slug });
	if (!story) {
		return next();
	}
	res.render( 'story', {story, title: "" });
};

exports.rateStory = async (req, res) => {
  // 1. Find the store given the id
	const story = await Story.findOne({_id: req.params.id});
	console.log('Found story for rating', story);
  // 2. Confirm their gender

  // 3. Save the rating
};

exports.editStory = async (req, res) => {
  // 1. Find the store given the ID
  const story = await Story.findOne({ _id: req.params.id });
  // 2. confirm they are the owner of the store
  // TODO
  // 3. Render out the edit form so the user can update their store
  res.render('editStore', { title: `Edit ${story.slug}`, story });
};


exports.updateStory = async (req, res) => {
  // find and update the store
  const story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true, // return the new store instead of the old one
    runValidators: true
  }).exec();
  req.flash('success', `Successfully updated <strong>${story.slug}</strong>. <a href="/story/${story.slug}">View Store →</a>`);
  res.redirect(`/stories/${store._id}/edit`);
  // Redriect them the store and tell them it worked
};
>>>>>>> Pagination.

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
	// 1. Query the database for a list of all the stories
	const stories = await Story.find();
	res.render('stories', { title: 'Stories', stories});
}
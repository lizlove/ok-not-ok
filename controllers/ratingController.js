const mongoose = require('mongoose');
const Rating = mongoose.model('Rating');
const Story = mongoose.model('Story');

exports.addRating = async (req, res, next) => {
  // Set story id.
  req.body.story = req.params.id;
  // Get rating from params and set as boolean.
  req.body.rating = req.query.rating;
  // Get author string from session id.
  req.body.author = req.sessionID;
  // Get gender from session gender and default to other if none stored.
  // TODO: remove default and don't save any genderless ratings
  let gender = req.session.gender ? parseInt(req.session.gender) : 2;
  req.body.gender = gender;
  const newRating = new Rating(req.body);
  newRating.save();
  
  next();
};
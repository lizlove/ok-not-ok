const mongoose = require('mongoose');
const Rating = mongoose.model('Rating');

exports.addRating = async (req, res) => {
  // Set story id.
  req.body.story = req.params.id;
  // Get rating from params and set as boolean.
  let isTrueSetRating = (req.query.rating == 'true');
  req.body.rating = isTrueSetRating;
  // Get author string from session id.
  req.body.author = req.sessionID;
  // Get gender from session gender and default to other if none stored.
  let gender = req.session.cookie.gender ? parseInt(req.session.cookie.gender) : 2;
  req.body.gender = gender;
  const newRating = new Rating(req.body);
  await newRating.save();
  req.flash('success', 'Rating Saved!');
  res.redirect('back');
};

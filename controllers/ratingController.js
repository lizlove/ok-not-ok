const mongoose = require('mongoose');
const Rating = mongoose.model('Rating');

exports.addRating = async (req, res) => {
  // 1. Get author string from session id.
  req.body.author = req.sessionID;
  // 2. Set store id
  req.body.story = req.params.id;
  // 3. Get rating from params
  req.body.rating = req.query.rating;
  console.log('newBody', req.body);
  const newRating = new Rating(req.body);
  await newRating.save();
  req.flash('success', 'Rating Saved!');
  res.redirect('back');
};

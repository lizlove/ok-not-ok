const mongoose = require('mongoose');
const Rating = mongoose.model('Rating');

exports.addRating = async (req, res) => {
  console.log('RETURNED', req);
  // 1. Get author string from session id.
  req.body.author = req.user._id;
  // 2. Set store id
  req.body.story = req.params.id;
  // 3. Set rating
  req.body.rating = req.query.rating;
  const newRating = new Rating(req.body);
  await newRating.save();
  req.flash('success', 'Rating Saved!');
  res.redirect('back');
};

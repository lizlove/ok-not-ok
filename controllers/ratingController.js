const mongoose = require('mongoose');
const Rating = mongoose.model('Rating');
const Story = mongoose.model('Story');

exports.addRating = async (req, res, next) => {
  req.body.story = req.params.id;
  req.body.rating = req.query.rating;
  // author string from session id.
  req.body.author = req.sessionID;
  // default gender to unsaved number, 88, if none stored.
  let gender = req.session.gender ? parseInt(req.session.gender) : 88;
  // do not save ratings from 88 users, otherwise save
  if(gender != 88) {
    req.body.gender = gender;
    const newRating = new Rating(req.body);
    newRating.save();
  }
  next();
};
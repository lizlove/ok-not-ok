const mongoose = require('mongoose');
// const Rating = mongoose.model('Rating'); //Singleton from mongoose

exports.rateStory = async (req, res) => {
    res.json(req.body);
};

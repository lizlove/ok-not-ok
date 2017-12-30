const express = require('express');
const router = express.Router();
const storyController = require('../controllers/storyController');
const { catchErrors } = require('../handlers/errorHandlers');

// Routing around
router.get('/', catchErrors(storyController.getStories));
router.get('/stories', catchErrors(storyController.getStories));
router.get('/add', storyController.addStory);
router.post('/add', catchErrors(storyController.createStory)); //wraps async+await mongoose function in higher order error handling function

module.exports = router;
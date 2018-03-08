const express = require('express');
const router = express.Router();
const storyController = require('../controllers/storyController');
const ratingController = require('../controllers/ratingController');
const { catchErrors } = require('../handlers/errorHandlers');

// Routing around
router.get('/', catchErrors(storyController.getStories));
router.get('/stories', catchErrors(storyController.getStories));
router.get('/stories/page/:page', catchErrors(storyController.getStories));

router.get('/story/:slug', catchErrors(storyController.getStoryBySlug));

// TODO: Add gender controller?
router.post('/ratings/:id',
    catchErrors(ratingController.rateStory)
);
router.get('/about', catchErrors(storyController.getAbout));

// TODO: These can be removed once data is uploaded on the backend
router.get('/submit', storyController.addStory);
router.post('/submit', catchErrors(storyController.createStory)); //wraps async+await mongoose function in higher order error handling function
router.get('/stories/:id/edit', catchErrors(storyController.editStory));

module.exports = router;

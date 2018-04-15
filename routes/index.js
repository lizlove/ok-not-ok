const express = require('express');
const router = express.Router();
const storyController = require('../controllers/storyController');
const ratingController = require('../controllers/ratingController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { catchErrors } = require('../handlers/errorHandlers');

// Routing around
router.get('/', catchErrors(storyController.getStories));
router.get('/stories', catchErrors(storyController.getStories));
router.get('/stories/page/:page', catchErrors(storyController.getStories));

router.get('/story/:slug', catchErrors(storyController.getStoryBySlug));

router.post('/ratings/:id',
    catchErrors(ratingController.rateStory)
);
router.get('/about', catchErrors(storyController.getAbout));

// For authenticated users
router.get('/submit', storyController.addStory);
router.post('/submit', catchErrors(storyController.createStory)); //wraps async+await mongoose function in higher order error handling function
router.get('/stories/:id/edit', catchErrors(storyController.editStory));

router.get('/login', userController.loginForm);
router.post('/login', authController.login);
router.get('/register', userController.registerForm);

// 1. Validate the registration data
// 2. register the user
// 3. we need to log them in
router.post('/register',
  userController.validateRegister,
  userController.register,
  authController.login
);

router.get('/logout', authController.logout);

router.get('/account', authController.isLoggedIn, userController.account);
router.post('/account', catchErrors(userController.updateAccount));
router.post('/account/forgot', catchErrors(authController.forgot));
router.get('/account/reset/:token', catchErrors(authController.reset));
router.post('/account/reset/:token',
  authController.confirmedPasswords,
  catchErrors(authController.update)
);

module.exports = router;

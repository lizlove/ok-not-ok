const express = require("express");
const router = express.Router();
const storyController = require("../controllers/storyController");
const ratingController = require("../controllers/ratingController");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const { catchErrors } = require("../handlers/errorHandlers");

// routing around
router.get("/", catchErrors(storyController.getStories));
router.get("/about", catchErrors(storyController.getAbout));

// TODO: Add randomization on initial landing
router.get("/stories", catchErrors(storyController.getStories));
router.get("/stories/page/:page", catchErrors(storyController.getStories));
router.get("/story/:slug", catchErrors(storyController.getStoryBySlug));

router.get("/submit", storyController.addStory);

router.get("/rating/:id", catchErrors(ratingController.getRating));
router.post(
  "/rating/:id",
  ratingController.addRating,
  storyController.updateRatingStats
);
router.get("/results", catchErrors(storyController.getTopResults));

// for authenticated users
router.get(
  "/stories/:id/edit",
  authController.isLoggedIn,
  storyController.editStory
);
router.post(
  "/stories/:id/delete",
  authController.isLoggedIn,
  storyController.deleteStory
);
router.post("/add", catchErrors(storyController.createStory));
router.post("/add/:id", catchErrors(storyController.updateStory));

router.get("/login", userController.loginForm);
router.post("/login", authController.login);
router.get("/register", userController.registerForm);

// registration with validation and autologin
router.post(
  "/register",
  userController.validateRegister,
  userController.register,
  authController.login
);

router.get("/logout", authController.logout);

router.get("/account", authController.isLoggedIn, userController.account);
router.post("/account", catchErrors(userController.updateAccount));
router.post("/account/forgot", catchErrors(authController.forgot));
router.get("/account/reset/:token", catchErrors(authController.reset));
router.post(
  "/account/reset/:token",
  authController.confirmedPasswords,
  authController.update
);

router.post(
  "/account/gender",
  authController.setGender,
  userController.setGender
);

module.exports = router;

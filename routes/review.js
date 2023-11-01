const express = require("express");
const router = express.Router({ mergeParams: true });
const { reviewSchema } = require("../schemas");
const catchAsync = require("../utils/catchAsync");
const expressErrors = require("../utils/expressErrors");
const CampGround = require("../models/campGround");
const Review = require("../models/review");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");

// const validateReview = (req, res, next) => {
//   const { error } = reviewSchema.validate(req.body);
//   if (error) {
//     const msg = error.details.map((info) => info.message).join(",");
//     throw new expressErrors(msg, 400);
//   } else {
//     next();
//   }
// };

router.post(
  "/",
  isLoggedIn,
  validateReview,
  catchAsync(async (req, res, next) => {
    const campground = await CampGround.findById(req.params.id);
    const review = await Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Review Added");
    res.redirect(`/campGround/${campground._id}`);
  })
);

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await CampGround.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted review");
    req.flash("error", "Something went wrong");
    res.redirect(`/campGround/${id}`);
  })
);

module.exports = router;

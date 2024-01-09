const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const expressErrors = require("../utils/expressErrors");
const reviews = require("../controllers/reviews");
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

router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createreview));

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.deletereview)
);

module.exports = router;

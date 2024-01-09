const Review = require("../models/review");
const CampGround = require("../models/campGround");

module.exports.createreview = async (req, res, next) => {
  const campground = await CampGround.findById(req.params.id);
  const review = await Review(req.body.review);
  review.author = req.user._id;
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  req.flash("success", "Review Added");
  res.redirect(`/campGround/${campground._id}`);
};

module.exports.deletereview = async (req, res) => {
  const { id, reviewId } = req.params;
  await CampGround.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Successfully deleted review");
  req.flash("error", "Something went wrong");
  res.redirect(`/campGround/${id}`);
};

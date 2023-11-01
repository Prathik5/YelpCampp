const { campgroundSchema, reviewSchema } = require("./schemas");
const expressErrors = require("./utils/expressErrors");
const CampGround = require("./models/campGround");
const Review = require("./models/review");

module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in");
    res.redirect("/login");
  }
  next();
};

module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((info) => info.message).join(",");
    throw new expressErrors(msg, 400);
  } else {
    next();
  }
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const camp = await CampGround.findById(id);
  if (!camp.author.equals(req.user._id)) {
    req.flash("error", "You are not allowed to do that!");
    return res.redirect(`/campground/${id}`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You are not allowed to do that!");
    return res.redirect(`/campground/${id}`);
  }
  next();
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((info) => info.message).join(",");
    throw new expressErrors(msg, 400);
  } else {
    next();
  }
};

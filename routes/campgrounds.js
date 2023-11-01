const express = require("express");
const router = express.Router();
const { campgroundSchema } = require("../schemas");
const catchAsync = require("../utils/catchAsync");
const CampGround = require("../models/campGround");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");

router.get(
  "/",
  catchAsync(async (req, res) => {
    const campground = await CampGround.find({});
    res.render("campground/index", { campground });
  })
);

router.get("/new", isLoggedIn, (req, res) => {
  res.render("campground/new");
});

router.post(
  "/",
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res, next) => {
    const campground = new CampGround(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash("success", "You have created a new campground");
    res.redirect(`/campGround/${campground._id}`);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await CampGround.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("author");
    if (!campground) {
      req.flash("error", "Couldn't find campground");
      return res.redirect("/campGround");
    }
    res.render("campground/show", { campground });
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await CampGround.findById(id);
    res.render("campground/edit", { campground });
  })
);

router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await CampGround.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    if (!campground) {
      req.flash("error", "Couldn't find campground");
      res.redirect("/campGround");
    }
    req.flash("success", "Successfully updated the campground");
    res.redirect(`/campground/${campground._id}`);
  })
);

router.delete(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await CampGround.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted Campground");
    res.redirect("/campGround");
  })
);

module.exports = router;

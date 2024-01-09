const CampGround = require("../models/campGround");

module.exports.index = async (req, res) => {
  const campground = await CampGround.find({});
  res.render("campground/index", { campground });
};

module.exports.renderForm = (req, res) => {
  res.render("campground/new");
};

module.exports.createCampGround = async (req, res, next) => {
  const campground = new CampGround(req.body.campground);
  campground.author = req.user._id;
  await campground.save();
  req.flash("success", "You have created a new campground");
  res.redirect(`/campGround/${campground._id}`);
};

module.exports.showCampGround = async (req, res) => {
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
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const campground = await CampGround.findById(id);
  res.render("campground/edit", { campground });
};

module.exports.updatecampground = async (req, res) => {
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
};

module.exports.deletecampground = async (req, res) => {
  const { id } = req.params;
  await CampGround.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted Campground");
  res.redirect("/campGround");
};

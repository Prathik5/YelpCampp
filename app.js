const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const CampGround = require("./models/campGround");
const methodOverride = require("method-override");
const catchAsync = require("./utils/catchAsync");
const expressErrors = require("./utils/expressErrors");
const campgroundSchema = require("./schemas");

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/yelpCamp");
  console.log("Connected");
}

main().catch((err) => console.log("Errors"));

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((info) => info.message).join(",");
    throw new expressErrors(msg, 400);
  } else {
    next();
  }
};

app.get("/", (req, res) => {
  res.render("home");
});

app.get(
  "/campGround",
  catchAsync(async (req, res) => {
    const campground = await CampGround.find({});
    res.render("campground/index", { campground });
  })
);

app.get("/campGround/new", (req, res) => {
  res.render("campground/new");
});

app.post(
  "/campGround",
  validateCampground,
  catchAsync(async (req, res, next) => {
    const campground = new CampGround(req.body.campground);
    await campground.save();
    res.redirect(`/campGround/${campground._id}`);
  })
);

app.get(
  "/campGround/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await CampGround.findById(id);
    res.render("campground/show", { campground });
  })
);

app.get(
  "/campGround/:id/edit",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await CampGround.findById(id);
    res.render("campground/edit", { campground });
  })
);

app.put(
  "/campGround/:id",
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await CampGround.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    res.redirect(`/campground/${campground._id}`);
  })
);

app.delete(
  "/campGround/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await CampGround.findByIdAndDelete(id);
    res.redirect("/campGround");
  })
);

app.use((err, req, res, next) => {
  res.send("Oh No!!Something went wrong");
});

app.all("*", (req, res, next) => {
  next(new expressErrors("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { status = 500 } = err;
  if (!err.message) err.message = "Oh! No something went wrong";
  res.status(status).render("errors", { err });
});

app.listen("3000", () => {
  console.log("Listening at Port 3000");
});

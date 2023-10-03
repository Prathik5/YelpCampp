const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const CampGround = require("./models/campGround");
const methodOverride = require("method-override");

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

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/campGround", async (req, res) => {
  const campground = await CampGround.find({});
  res.render("campground/index", { campground });
});

app.get("/campGround/new", (req, res) => {
  res.render("campground/new");
});

app.post("/campGround", async (req, res) => {
  const campground = new CampGround(req.body.campground);
  await campground.save();
  res.redirect(`/campGround/${campground._id}`);
});

app.get("/campGround/:id", async (req, res) => {
  const { id } = req.params;
  const campground = await CampGround.findById(id);
  res.render("campground/show", { campground });
});

app.get("/campGround/:id/edit", async (req, res) => {
  const { id } = req.params;
  const campground = await CampGround.findById(id);
  res.render("campground/edit", { campground });
});

app.put("/campGround/:id", async (req, res) => {
  const { id } = req.params;
  const campground = await CampGround.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  res.redirect(`/campground/${campground._id}`);
});

app.delete("/campGround/:id", async (req, res) => {
  const { id } = req.params;
  const campground = await CampGround.findByIdAndDelete(id);
  res.redirect("/campGround");
});

app.listen("3000", () => {
  console.log("Listening at Port 3000");
});

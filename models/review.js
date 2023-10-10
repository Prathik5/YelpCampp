const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewSchema = new Schema({
  body: String,
  rating: {
    type: Number,
    required: [true, "A rating is required"],
  },
});

module.exports = mongoose.model("Review", reviewSchema);

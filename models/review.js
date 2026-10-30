// models / review.js;
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const reviewSchema = new Schema(
  {
    rating: Number,
    body: String,
  },
  { versionKey: "_revision" }, // Stores as _revision: 0
);

// CommonJS
// module.exports = mongoose.model("yelpcamp", CampgroundSchema);
// ESM
const Review = mongoose.model("Review", reviewSchema, "yelpreviews");

// named export
// export { Campground };
// default export
export default Review;

// models/campground.js;
import mongoose from "mongoose";
import Review from "./review.js";
const Schema = mongoose.Schema;

const campgroundSchema = new Schema(
  {
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  { versionKey: "_revision" }, // Stores as _revision: 0
);

// Query middleware
campgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
    console.log(
      "CAMPGROUND.js MIDDLEWARE - DELETED ALL REVIEWS ASSOCIATED WITH THIS CAMPGROUND ---------------------------- ",
    );
  }
});

// CommonJS
// module.exports = mongoose.model("yelpcamp", CampgroundSchema);

// ESM
// const Campground = mongoose.model("yelpcamp", CampgroundSchema);

const Campground = mongoose.model("Campground", campgroundSchema, "yelpcamps");

// named export
// export { Campground };

// default export
export default Campground;

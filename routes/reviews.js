// routes/reviews.js
import express from "express";
const router = express.Router({ mergeParams: true });

//from a default export
import Campground from "../models/campground.js";
import Review from "../models/review.js";

import { reviewSchema } from "../schemas.js"; // joi shema

import { ExpressError } from "../utils/ExpressError.js";
import { catchAsync } from "../utils/catchAsync.js";

const validateReview = (req, res, next) => {
  console.log("validateReview called.......");
  const { error } = reviewSchema.validate(req.body);

  if (error) {
    console.log(`ERROR IS ------>   ${error}`);
    const msg = error.details.map((element) => element.message).join(","); // return an array joined to a new string on a comma
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// import { catchAsync } from "../utils/catchAsync.js";
// import { ExpressError } from "../utils/ExpressError.js";
// import Review from "../models/review.js";
// import { campgroundSchema } from "../schemas.js"; // joi shema

// POST route for adding reviews to a campground
// "/campgrounds/:id/reviews",
router.post(
  "/",
  validateReview,
  catchAsync(async (req, res) => {

    console.log("\n\n ******************* start router.post route hit for adding a review  ************************************************");
    console.log("req.params =", JSON.stringify(req.params, " ", 4));
    console.log("req.body =", JSON.stringify(req.body, " ", 4));
    console.log("req.originalUrl =", req.originalUrl);
    console.log(" ******************* end router.post route hit for adding a review ***************************************************\n");

    const { id } = req.params; // to get the campground id from the request
    // console.log(`THE CAMPGROUND ID IS: ${id}`);
    
    const { formRating, formBody } = req.body; // to get the rating info frmo the submitted page on campgrounds/show.ejs page

    // const campground = await Campground.findById(req.params.id);
    const campground = await Campground.findById(id);
    const newReview = new Review({
      body: formBody,
      rating: formRating,
    });

    console.log("the new review object is: ", JSON.stringify(newReview, null, 3));

    campground.reviews.push(newReview);
    await newReview.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  }),
);

// delete a review on a particular campground page, and delete the reviewId from yelpcamps collection too
router.delete(
  "/:reviewId",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // pull the reviewId from the campground reviews array
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
  }),
);

export { router as reviewRoutes };

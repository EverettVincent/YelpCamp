// middleware.js
import { campgroundSchema, reviewSchema } from "./schemas.js"; // joi shema
import { ExpressError } from "./utils/ExpressError.js";
import Campground from "./models/campground.js";
import Review from "./models/review.js";


const isLoggedIn = (req, res, next) => {
    console.log("REQ.USER...", req.user);
    if (!req.isAuthenticated()) {
        // if not loggedin, store url they are requesting before redirecting back to login
        // console.log(req.path,req.originalUrl);
        
        req.session.returnTo = req.originalUrl;
        req.flash("error", "You must be signed in first");
        return res.redirect("/login");
    }
    next();
}

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body); // just use the error from result array

  if (error) {
    console.log(`ERROR IS ------>   ${error}`);
    const msg = error.details.map((element) => element.message).join(","); // return an array joined to a new string on a comma
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

const isAuthor = async(req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if(!campground.author.equals(req.user._id))  {
      req.flash("error", "You do not have permission to do that");
      return res.redirect(`/campgrounds/${id}`);
  }
  next();
}

const isReviewAuthor = async(req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id))  {
      req.flash("error", "You do not have permission to do that");
      return res.redirect(`/campgrounds/${id}`);
  }
  next();
}

const storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }

    next();
}

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


export { isLoggedIn, validateCampground, isAuthor, storeReturnTo, validateReview, isReviewAuthor }
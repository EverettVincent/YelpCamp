import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import compression from "compression";
import methodOverride from "method-override";
import path from "path";
import ejsMate from "ejs-mate";
import { campgroundSchema, reviewSchema } from "./schemas.js";
import { catchAsync } from "./utils/catchAsync.js";
import { ExpressError } from "./utils/ExpressError.js";

// // from a named export
// import { Campground } from "./models/campground.js"; // import the model from campground.js file

//from a default export
import Campground from "./models/campground.js";
import Review from "./models/review.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.set("views", path.join(__dirname, "views"));

app.set("view engine", "ejs");
app.engine("ejs", ejsMate); // use this engine instead of the default one

app.use(compression());
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true })); // need this to make express parse url params
app.use(express.json());

// connect with mongoose to mongoDB
// mongoose
//   .connect(process.env.LOCAL_DB_URL)
//   .then(() => {
//     console.log("MONGO DB CONNECTION OPEN TO campgroundDB");
//   })
//   .catch((e) => {
//     console.log("FAILED TO CONNECT TO campgroundDB!");
//     console.log(e);
//   });

// connect with mongoose to cloud mongoDB at Atlas cloud.mongodb.com
mongoose
  .connect(process.env.MONGO_ATLAS_DB_URL)
  .then(() => {
    console.log("MONGO DB CONNECTION OPEN TO campgroundDB...");
  })
  .catch((e) => {
    console.log("FAILED TO CONNECT TO campgroundDB!");
    console.log(e);
  });

// ---------------- Middleware Functions ---------------------------------

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

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);

  if (error) {
    console.log(`ERROR IS ------>   ${error}`);
    const msg = error.details.map((element) => element.message).join(","); // return an array joined to a new string on a comma
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// ---------------- Static Routes ----------------------------------------

app.get("/", (req, res) => {
  console.log("Home Route Hit - HELLO FROM YELP CAMP!");
  res.render("home.ejs");
});

// INDEX     /campgrounds    GET
app.get("/campgrounds", async (req, res) => {
  const allCampgrounds = await Campground.find({}); // mongoose
  res.render("campgrounds/index.ejs", { allCampgrounds });
});

// NEW    /campgrounds/new    GET
app.get("/campgrounds/new", async (req, res) => {
  res.render("campgrounds/new.ejs");
});

// CREATE     /campgrounds     POST
app.post(
  "/campgrounds",
  validateCampground,
  catchAsync(async (req, res, next) => {
    // from actual form
    const { formTitle, formLocation, formImage, formPrice, formDescription } =
      req.body;

    // from Hopscotch.io test
    // const { formTitle, formLocation, formImage, formPrice, formDescription } =
    //   req.body.campground;

    console.log("Saving the following campground ...........");
    console.log(" --------------------------- ");
    console.log(req.body);
    console.log(" --------------------------- ");

    const newCamp = new Campground({
      title: formTitle,
      location: formLocation,
      image: formImage,
      price: formPrice,
      description: formDescription,
    });
    await newCamp.save();
    res.redirect(`/campgrounds/${newCamp["_id"]}`);

    // res.redirect(`/campgrounds/${_id}`); // _id not created until save()
    // res.redirect("/campgrounds/6ab295fab0eb0ab21c73f6a5");
  }),
);

// ---------------------- Dynamic Routes ------------------------------------------

// SHOW    /campgrounds/:id     GET
app.get(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    console.log("SHOW Campground By Id route hit");
    console.log(req.params);
    // const { id: prodId } = req.params;
    const { id } = req.params;

    // const foundCamp = await Campground.find({ _id: prodId });
    // const foundCamp = await Campground.findById(req.params.id);
    // const foundCamp = await Campground.findById({ _id: prodId }).populate(
    //   "reviews",
    // );
    const foundCamp = await Campground.findById({ _id: id }).populate(
      "reviews",
    );

    console.log(`We found the camp ${foundCamp}`);
    res.render("campgrounds/show.ejs", { foundCamp });
  }),
);

// EDIT     /campgrounds/:id/edit     GET     -- get edit.ejs form
app.get(
  "/campgrounds/:id/edit",
  catchAsync(async (req, res) => {
    const { id: reqId } = req.params;
    const foundCamp = await Campground.find({ _id: reqId });
    res.render("campgrounds/edit.ejs", { foundCamp });
  }),
);

// UPDATE      /campgrounds/:id       PATCH      -- called from save in edit.ejs form
app.patch(
  "/campgrounds/:id",
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const foundCampToUpdate = await Campground.find({ _id: id });
    const { formTitle, formLocation, formImage, formPrice, formDescription } =
      req.body;

    foundCampToUpdate[0].title = formTitle;
    foundCampToUpdate[0].location = formLocation;
    foundCampToUpdate[0].image = formImage;
    foundCampToUpdate[0].price = formPrice;
    foundCampToUpdate[0].description = formDescription;

    console.log("Finished Update Route in app.patch.", foundCampToUpdate[0]);

    await foundCampToUpdate[0].save();

    res.redirect(`/campgrounds/${id}`);
  }),
);

// DESTROY       /campgrounds/:id       DELETE                  --  call this from a delete button that uses ?_method=DELETE
app.delete(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    // const foundCampToDelete = await Campground.findOne({ _id: id });
    // await foundCampToDelete.deleteOne();
    const deleteResult = await Campground.findByIdAndDelete({ _id: id });
    res.redirect("/campgrounds");
  }),
);

// POST route for adding reviews to a campground
app.post(
  "/campgrounds/:id/reviews",
  validateReview,
  catchAsync(async (req, res) => {
    // res.send("You Made It to Post Review Route Hit ... ");
    console.log("app.post Route Hit For Adding A Review*****");
    console.log(req.body);
    const { formRating, formBody } = req.body;

    const campground = await Campground.findById(req.params.id);
    const newReview = new Review({
      body: formBody,
      rating: formRating,
    });
    campground.reviews.push(newReview);
    await newReview.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  }),
);

// delete a review on a particular campground page, and delete the reviewId from yelpcamps collection too
app.delete(
  "/campgrounds/:id/reviews/:reviewId",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // pull the reviewId from the campground reviews array
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
  }),
);

app.all("/{*path}", (req, res, next) => {
  // res.send("404!!!!!!!");
  next(
    new ExpressError(
      "FROM app.all(*path) -- The Page for this URL was not found at all",
      404,
    ),
  );
});

app.use((err, req, res, next) => {
  console.log(
    " &&&&&&& Hello, START of the default app.use err was called &&&&&&&",
  );

  const { statusCode = 500 } = err;
  if (!err.message) {
    err.message = "DEFAULT --- Ohhhhhhhh Noooooooo, Somethinggg Wenttt Wronggg";
  }

  console.log(
    " &&&&&&& Hello, END of the default app.use err was called &&&&&&&",
  );
  res.status(statusCode).render("error.ejs", { err });
});

app.listen(3000, () => {
  console.log("YelpCamp is Listening on 3000...");
});

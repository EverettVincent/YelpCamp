// routes/campgrounds.js
import express from "express";
const router = express.Router();
import { catchAsync } from "../utils/catchAsync.js";
import { ExpressError } from "../utils/ExpressError.js";
import Campground from "../models/campground.js";
import { campgroundSchema } from "../schemas.js"; // joi shema

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

// INDEX     /campgrounds    GET
router.get("/", async (req, res) => {
  const allCampgrounds = await Campground.find({}); // mongoose
  res.render("campgrounds/index.ejs", { allCampgrounds });
});

// NEW    /campgrounds/new    GET
router.get("/new", async (req, res) => {
  res.render("campgrounds/new.ejs");
});

// CREATE     /campgrounds     POST
router.post(
  "/",
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
    req.flash("success", "Successfully made a new campground!");
    res.redirect(`/campgrounds/${newCamp["_id"]}`);

    // res.redirect(`/campgrounds/${_id}`); // _id not created until save()
    // res.redirect("/campgrounds/6ab295fab0eb0ab21c73f6a5");
  }),
);

// ---------------------- Dynamic Routes ------------------------------------------

// SHOW    /campgrounds/:id     GET
router.get(
  "/:id",
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
router.get(
  "/:id/edit",
  catchAsync(async (req, res) => {
    const { id: reqId } = req.params;
    const foundCamp = await Campground.find({ _id: reqId });
    res.render("campgrounds/edit.ejs", { foundCamp });
  }),
);

// UPDATE      /campgrounds/:id       PATCH      -- called from save in edit.ejs form
router.patch(
  "/:id",
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
router.delete(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    // const foundCampToDelete = await Campground.findOne({ _id: id });
    // await foundCampToDelete.deleteOne();
    const deleteResult = await Campground.findByIdAndDelete({ _id: id });
    res.redirect("/campgrounds");
  }),
);

export { router as campgroundRoutes };

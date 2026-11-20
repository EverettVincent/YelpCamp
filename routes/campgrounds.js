// routes/campgrounds.js
import express from "express";
const router = express.Router();
import { catchAsync } from "../utils/catchAsync.js";
import { ExpressError } from "../utils/ExpressError.js";
import Campground from "../models/campground.js";
// import { campgroundSchema } from "../schemas.js"; // joi shema
import { isLoggedIn, validateCampground, isAuthor } from "../middleware.js";



// INDEX     /campgrounds    GET
router.get("/", async (req, res) => {
  const allCampgrounds = await Campground.find({}); // mongoose
  res.render("campgrounds/index.ejs", { allCampgrounds });
});

// NEW    /campgrounds/new    GET
router.get("/new", isLoggedIn, async (req, res) => {
  res.render("campgrounds/new.ejs");
});

// CREATE     /campgrounds     POST
router.post(
  "/",
  isLoggedIn,
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
      author: req.user._id,
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
    ).populate("author");
    console.log(foundCamp);

    if (!foundCamp) {
      req.flash("error", "Cannot find that campground?");
      return res.redirect("/campgrounds");
    }

    console.log(`We found the camp ${foundCamp}`);
    res.render("campgrounds/show.ejs", { foundCamp });
  }),
);

// EDIT     /campgrounds/:id/edit     GET     -- get edit.ejs form
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id: reqId } = req.params;
    const foundCamp = await Campground.find({ _id: reqId });

    if (!foundCamp[0]) {
      console.log("\n\n\n -------- COULD NOT FIND CAMP TO EDIT BECAUSE THE CAMP WAS DELETED ----------- \n\n\n");
      req.flash("error", "Can not edit because this campground does not exist.");
      return res.redirect("/campgrounds");
    }

    res.render("campgrounds/edit.ejs", { foundCamp });
  }),
);

// UPDATE      /campgrounds/:id       PATCH      -- called from save in edit.ejs form
router.patch(
  "/:id",
  isLoggedIn,
  isAuthor,
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
    req.flash("success", "Successfully updated the campground.");
    res.redirect(`/campgrounds/${id}`);
  }),
);

// DESTROY       /campgrounds/:id       DELETE                  --  call this from a delete button that uses ?_method=DELETE
router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    // const deleteResult = await Campground.findByIdAndDelete({ _id: id });
    const foundCampToDelete = await Campground.findOne({ _id: id });
    
    await foundCampToDelete.deleteOne();
    req.flash("success", "Successfully deleted the campground!");
    res.redirect("/campgrounds");
  }),
);


export { router as campgroundRoutes };

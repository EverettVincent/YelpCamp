import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import compression from "compression";
import methodOverride from "method-override";
import path from "path";
import ejsMate from "ejs-mate";
import session from "express-session";
import flash from "connect-flash";
import { campgroundSchema, reviewSchema } from "./schemas.js"; // joi shema
import { catchAsync } from "./utils/catchAsync.js";
import { ExpressError } from "./utils/ExpressError.js";
import { campgroundRoutes } from "./routes/campgrounds.js";
import { reviewRoutes } from "./routes/reviews.js";

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
app.use(express.static(path.join("public"))); // to use the static assets in the public dir

const sessionConfig = {
  secret: "thisshouldbeabettersecret!",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + (1000 * 60 * 60 * 24 * 7),
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}
app.use(session(sessionConfig));  // to use session cookies
app.use(flash());

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

// ---------------- Middleware -----------------------------------------------
app.use((req, res, next) => {
  console.log("\n\n Middleware success message call \n\n");
  res.locals.success = req.flash("success");  // every request, if flash message, will have access under the key "success"
  res.locals.error = req.flash("error");       // every request, if flash message, will have access under the key "error"
  next();
});

// ---------------- From Routes Files ----------------------------------------
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);  // added mergeParams paramater in routes/reviews.js
// app.use("/campgrounds", reviewRoutes);

app.get("/", (req, res) => {
  console.log("Home Route Hit - HELLO FROM YELP CAMP!");
  res.render("home.ejs");
});

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

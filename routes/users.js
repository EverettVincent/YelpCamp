// routes/users.js
import express from "express";
const router = express.Router();
import User from "../models/user.js";
import { catchAsync } from "../utils/catchAsync.js";
import passport from "passport";
import { storeReturnTo } from "../middleware.js";

// import LocalStrategy from "passport-local";

// passport.use(
//   new LocalStrategy(
//     {
//       usernameField: "formUsername",
//       passwordField: "formPassword"
//     },
//     User.authenticate()
//   )
// );

router.get("/register", (req, res) => {
  res.render("users/register.ejs");
});

router.post("/register", catchAsync(async (req, res, next) => {
  
    console.log("\n\n ******************* start router.post route hit for registering a new user  ************************************************");
    console.log("req.params =", JSON.stringify(req.params, " ", 4));
    console.log("req.body =", JSON.stringify(req.body, " ", 4));
    console.log("req.originalUrl =", req.originalUrl);
    console.log(" ******************* end router.post route hit for registering a new user ***************************************************\n");

  try {
    const { formEmail, formUsername, formPassword } = req.body;
    const user = new User({ username: formUsername, email: formEmail });
    const registeredUser = await User.register(user, formPassword);
    req.login(registeredUser, err => {
      if (err) return next(err);
      req.flash("success", "Welcome to Yelp Camp!");
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("register.ejs");
  }
  
}));

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post("/login", (req, res, next) => 
      // show what the req body params are
  {
    console.log(req.body);
    next();
  },
      // use the storeReturnTo middleware to save the returnTo value from session to res.locals  
  storeReturnTo,
      // passport.authenticate logs the user in and clears req.session
  passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }),
      // Now we can use res.locals.returnTo to redirect the user after login
  (req, res) => {

    console.log("\n\n ******************* start router.post route hit for logging in a user  ************************************************");
    console.log("req.params =", JSON.stringify(req.params, " ", 4));
    console.log("req.body =", JSON.stringify(req.body, " ", 4));
    console.log("req.originalUrl =", req.originalUrl);
    console.log(" ******************* end router.post route hit for logging in a user ***************************************************\n");
  
  req.flash("success", "welcome back!");
  const redirectUrl = res.locals.returnTo || "/campgrounds";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
});

router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
      if (err) {
        return next(err);
      }
    req.flash("success", "Goodbye!");
    res.redirect("/campgrounds");
  });
});

// route test
// router.post("/login", (req, res, next) => {
//   console.log("body:", req.body);

//   passport.authenticate("local", (err, user, info) => {
//     console.log("err:", err);
//     console.log("user:", user);
//     console.log("info:", info);
//     console.log("info name:", info?.name);
//     console.log("info message:", info?.message);    

//     res.send("check console");
//   })(req, res, next);
// });


export { router as userRoutes };




